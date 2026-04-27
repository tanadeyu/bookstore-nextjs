# Step 7: 商品管理ページ

**実施日**: 2026-04-27
**ステータス**: ✅ 完了

## 目的

商品一覧ページを作成し、商品マスタの閲覧機能を実装する。

## 手順

### 1. 商品一覧ページ作成

**ファイル:** `nextjs/app/products/page.tsx`

```typescript
import { db } from "@/lib/db";
import { products } from "@/drizzle/schema";

async function getProducts() {
  const allProducts = await db.select().from(products).orderBy(products.id);
  return allProducts;
}

export default async function ProductsPage() {
  const productList = await getProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">商品一覧</h1>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">商品名</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">説明</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">価格</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">在庫</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {productList.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{product.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  {product.price ? `¥${product.price.toLocaleString()}` : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{product.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {productList.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          商品が登録されていません
        </div>
      )}
    </div>
  );
}
```

## 機能

### 商品一覧表示
- 全商品を一覧表示
- ID、商品名、説明、価格、在庫数を表示
- ID 順にソート

### データ取得
- Server Component でデータ取得
- Drizzle ORM の `select()` を使用
- `orderBy()` で ID 順にソート

## 使用する Drizzle ORM 機能

- `select()` - データ取得
- `orderBy()` - ソート

## 次のステップ

Step 8: 顧客管理ページ
