import { db } from "@/lib/db";
import { products, sales, customers, categories, saleHeaders, productCategories } from "@/drizzle/schema";
import { count, sum, desc, sql } from "drizzle-orm";
import { eq } from "drizzle-orm";

async function getDashboardData() {
  // 売上ランキング
  const salesRanking = await db
    .select({
      productId: sales.productId,
      productName: products.name,
      totalAmount: sql<number>`sum(${sales.quantity} * ${sales.salePrice})`.mapWith(Number),
      totalQuantity: sum(sales.quantity).mapWith(Number),
    })
    .from(sales)
    .innerJoin(products, eq(sales.productId, products.id))
    .groupBy(sales.productId)
    .orderBy(desc(sql`sum(${sales.quantity} * ${sales.salePrice})`))
    .limit(10);

  // カテゴリ別集計
  const allCategories = await db.select().from(categories);

  const categorySummary = await Promise.all(
    allCategories.map(async (cat) => {
      const result = await db
        .select({
          totalAmount: sql<number>`sum(${sales.quantity} * ${sales.salePrice})`.mapWith(Number),
          totalQuantity: sum(sales.quantity).mapWith(Number),
        })
        .from(sales)
        .innerJoin(products, eq(sales.productId, products.id))
        .innerJoin(productCategories, eq(products.id, productCategories.productId))
        .where(eq(productCategories.categoryId, cat.id));

      return {
        categoryName: cat.name,
        totalAmount: result[0]?.totalAmount || 0,
        totalQuantity: result[0]?.totalQuantity || 0,
      };
    })
  );

  // 売上順にソート
  categorySummary.sort((a, b) => b.totalAmount - a.totalAmount);

  // 顧客別分析
  const customerSales = await db
    .select({
      customerId: customers.id,
      customerName: customers.name,
      totalAmount: sql<number>`sum(${sales.quantity} * ${sales.salePrice})`.mapWith(Number),
    })
    .from(sales)
    .innerJoin(saleHeaders, eq(sales.saleHeaderId, saleHeaders.id))
    .innerJoin(customers, eq(saleHeaders.customerId, customers.id))
    .groupBy(customers.id)
    .orderBy(desc(sql`sum(${sales.quantity} * ${sales.salePrice})`))
    .limit(10);

  return {
    salesRanking,
    categorySummary,
    customerSales,
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">ダッシュボード</h1>

      {/* 売上ランキング */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">売上ランキング</h2>
        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-400">
          <table className="min-w-full divide-y divide-gray-400">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ランク</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">商品名</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">売上金額</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">数量</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.salesRanking.map((item, index) => (
                <tr key={item.productId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.productName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">¥{item.totalAmount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{item.totalQuantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* カテゴリ別集計 */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">カテゴリ別集計</h2>
        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-400">
          <table className="min-w-full divide-y divide-gray-400">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">カテゴリ</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">売上金額</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">数量</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.categorySummary.map((item) => (
                <tr key={item.categoryName}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.categoryName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">¥{item.totalAmount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{item.totalQuantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 顧客別分析 */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">顧客別分析</h2>
        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-400">
          <table className="min-w-full divide-y divide-gray-400">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">顧客名</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">合計購入金額</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.customerSales.map((item) => (
                <tr key={item.customerId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.customerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">¥{item.totalAmount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
