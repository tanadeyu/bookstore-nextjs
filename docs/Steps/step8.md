# Step 8: 顧客管理ページ

**実施日**: 2026-04-27
**ステータス**: ✅ 完了

## 目的

顧客一覧ページを作成し、顧客マスタの閲覧機能を実装する。

## 手順

### 1. 顧客一覧ページ作成

**ファイル:** `nextjs/app/customers/page.tsx`

```typescript
import { db } from "@/lib/db";
import { customers } from "@/drizzle/schema";

async function getCustomers() {
  const allCustomers = await db.select().from(customers).orderBy(customers.id);
  return allCustomers;
}

export default async function CustomersPage() {
  const customerList = await getCustomers();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">顧客一覧</h1>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">氏名</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">メールアドレス</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">会員番号</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customerList.map((customer) => (
              <tr key={customer.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.email || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.memberNumber || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {customerList.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          顧客が登録されていません
        </div>
      )}
    </div>
  );
}
```

## 機能

### 顧客一覧表示
- 全顧客を一覧表示
- ID、氏名、メールアドレス、会員番号を表示
- ID 順にソート

### データ取得
- Server Component でデータ取得
- Drizzle ORM の `select()` を使用
- `orderBy()` で ID 順にソート

## 使用する Drizzle ORM 機能

- `select()` - データ取得
- `orderBy()` - ソート

## 次のステップ

Step 9: 販売管理ページ (一覧 + 詳細)
