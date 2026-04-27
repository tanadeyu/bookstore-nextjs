# Step 6: ダッシュボード (ランキング、集計)

**実施日**: 2026-04-27
**ステータス**: ✅ 完了

## 目的

ダッシュボードページを作成し、売上ランキング・カテゴリ別集計・顧客別分析を表示する。

## 手順

### 1. ダッシュボードページ作成

**ファイル:** `nextjs/app/page.tsx`

```typescript
import { db } from "@/lib/db";
import { products, sales, customers, categories, saleHeaders, productCategories } from "@/drizzle/schema";
import { count, sum } from "drizzle-orm";
import { eq } from "drizzle-orm";

async function getDashboardData() {
  // 売上ランキング
  const salesRanking = await db
    .select({
      productId: sales.productId,
      productName: products.name,
      totalAmount: sum(sales.salePrice).mapWith(Number),
      totalQuantity: sum(sales.quantity).mapWith(Number),
    })
    .from(sales)
    .innerJoin(products, eq(sales.productId, products.id))
    .groupBy(sales.productId)
    .orderBy((desc) => desc(totalAmount))
    .limit(10);

  // カテゴリ別集計
  const categorySummary = await db
    .select({
      categoryName: categories.name,
      totalAmount: sum(sales.salePrice).mapWith(Number),
      productCount: count(products.id).mapWith(Number),
    })
    .from(sales)
    .innerJoin(products, eq(sales.productId, products.id))
    .innerJoin(productCategories, eq(products.id, productCategories.productId))
    .innerJoin(categories, eq(productCategories.categoryId, categories.id))
    .groupBy(categories.id)
    .orderBy((desc) => desc(totalAmount));

  // 顧客別分析
  const customerSales = await db
    .select({
      customerId: customers.id,
      customerName: customers.name,
      totalAmount: sum(sales.salePrice).mapWith(Number),
    })
    .from(sales)
    .innerJoin(saleHeaders, eq(sales.saleHeaderId, saleHeaders.id))
    .innerJoin(customers, eq(saleHeaders.customerId, customers.id))
    .groupBy(customers.id)
    .orderBy((desc) => desc(totalAmount))
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">ダッシュボード</h1>

      {/* 売上ランキング */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">売上ランキング</h2>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
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
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">カテゴリ</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">売上金額</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">商品数</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.categorySummary.map((item) => (
                <tr key={item.categoryName}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.categoryName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">¥{item.totalAmount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{item.productCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 顧客別分析 */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">顧客別分析</h2>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
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
```

## 機能

### 売上ランキング
- 商品別の売上金額・数量を集計
- 上位10件を表示
- 売上金額の降順でソート

### カテゴリ別集計
- カテゴリごとの売上金額を集計
- カテゴリ内の商品数を表示
- 売上金額の降順でソート

### 顧客別分析
- 顧客ごとの合計購入金額を集計
- 上位10件を表示
- 購入金額の降順でソート

## 使用する Drizzle ORM 機能

- `select()` - データ取得
- `innerJoin()` - テーブル結合
- `groupBy()` - グループ化
- `sum()` - 合計集計
- `count()` - 件数集計
- `orderBy()` - ソート
- `limit()` - 件数制限

## 次のステップ

Step 7: 商品管理ページ
