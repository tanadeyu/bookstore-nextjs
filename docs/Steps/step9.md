# Step 9: 販売管理ページ (一覧 + 詳細)

**実施日**: 2026-04-27
**ステータス**: ✅ 完了

## 目的

販売一覧ページを作成し、販売データの閲覧機能を実装する。

## 手順

### 1. 販売一覧ページ作成

**ファイル:** `nextjs/app/sales/page.tsx`

```typescript
import { db } from "@/lib/db";
import { saleHeaders, sales, products, customers } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

async function getSaleHeaders() {
  const headers = await db
    .select({
      id: saleHeaders.id,
      saleDate: saleHeaders.saleDate,
      customerId: saleHeaders.customerId,
      customerName: customers.name,
    })
    .from(saleHeaders)
    .innerJoin(customers, eq(saleHeaders.customerId, customers.id))
    .orderBy(saleHeaders.id);

  return headers;
}

export default async function SalesPage() {
  const saleList = await getSaleHeaders();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">販売一覧</h1>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">販売日</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">顧客名</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">詳細</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {saleList.map((sale) => (
              <tr key={sale.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.saleDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sale.customerName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <a
                    href={`/sales/${sale.id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    詳細
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {saleList.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          販売データが登録されていません
        </div>
      )}
    </div>
  );
}
```

### 2. 販売詳細ページ作成

**ファイル:** `nextjs/app/sales/[id]/page.tsx`

```typescript
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
  params: { id: string };
}) {
  const data = await getSaleDetail(Number(params.id));

  if (!data) {
    return <div>販売データが見つかりません</div>;
  }

  const totalAmount = data.items.reduce((sum, item) => sum + (item.salePrice * item.quantity), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">販売詳細</h1>
      
      <div className="bg-white shadow rounded-lg p-6 mb-6">
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
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">明細</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">商品名</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">数量</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">単価</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">小計</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
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
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          一覧に戻る
        </a>
      </div>
    </div>
  );
}
```

## 機能

### 販売一覧
- 全販売ヘッダーを一覧表示
- ID、販売日、顧客名を表示
- 詳細ページへのリンク

### 販売詳細
- ヘッダー情報（販売ID、販売日、顧客名、合計金額）
- 明細情報（商品名、数量、単価、小計）
- 合計金額の計算

### データ取得
- Server Component でデータ取得
- Drizzle ORM の `select()`, `innerJoin()`, `where()` を使用
- 動的ルーティング（`[id]`）を使用

## 使用する Drizzle ORM 機能

- `select()` - データ取得
- `innerJoin()` - テーブル結合
- `where()` - 条件指定
- `limit()` - 件数制限

## 次のステップ

Step 10: 販売登録フォーム (Server Actions + トランザクション)
