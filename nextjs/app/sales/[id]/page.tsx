import { db } from "@/lib/db";
import { saleHeaders, sales, products, customers } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

async function getSaleDetail(id: number) {
  const header = await db
    .select({
      id: saleHeaders.id,
      saleDate: saleHeaders.saleDate,
      customerId: saleHeaders.customerId,
      customerName: customers.name,
    })
    .from(saleHeaders)
    .innerJoin(customers, eq(saleHeaders.customerId, customers.id))
    .where(eq(saleHeaders.id, id))
    .limit(1);

  if (!header[0]) {
    return null;
  }

  const items = await db
    .select({
      productName: products.name,
      quantity: sales.quantity,
      salePrice: sales.salePrice,
    })
    .from(sales)
    .innerJoin(products, eq(sales.productId, products.id))
    .where(eq(sales.saleHeaderId, id));

  return {
    header: header[0],
    items,
  };
}

export default async function SaleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getSaleDetail(Number(id));

  if (!data) {
    return <div>販売データが見つかりません</div>;
  }

  const totalAmount = data.items.reduce((sum, item) => sum + (item.salePrice * item.quantity), 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">販売詳細 #{data.header.id}</h1>

      <div className="bg-white shadow rounded-lg p-6 mb-6 border border-gray-400">
        <h2 className="text-xl font-semibold mb-4">ヘッダー情報</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">販売ID</p>
            <p className="text-lg font-medium">{data.header.id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">販売日</p>
            <p className="text-lg font-medium">{data.header.saleDate}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">顧客名</p>
            <p className="text-lg font-medium">{data.header.customerName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">合計金額</p>
            <p className="text-lg font-medium">¥{totalAmount.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 border border-gray-400">
        <h2 className="text-xl font-semibold mb-4">明細</h2>
        <table className="min-w-full divide-y divide-gray-400">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">商品名</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">数量</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">単価</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">小計</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-400">
            {data.items.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.productName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{item.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">¥{item.salePrice.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  ¥{(item.salePrice * item.quantity).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <a
          href="/sales"
          className="inline-flex items-center px-4 py-2 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100"
        >
          一覧に戻る
        </a>
      </div>
    </div>
  );
}
