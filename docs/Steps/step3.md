# Step 3: データベーススキーマ定義

**実施日**: 2026-04-27
**ステータス**: ✅ 完了

## 目的

Drizzle ORM でデータベーススキーマを定義し、DB接続設定を行う。

## 手順

### 1. スキーマ定義の確認

Rust版のテーブル定義（`Reference/migrations/init.sql`）を参考にする。

**テーブル構造:**
```
categories (カテゴリマスタ)
  ↑ N:N
products (商品マスタ)
  ↑ N:1
sales (販売明細)
  ↑ N:1
sale_headers (販売ヘッダー)
  ↑ N:1
customers (顧客マスタ)
```

### 2. Drizzle スキーマ作成

**ファイル:** `nextjs/drizzle/schema.ts`

**主なポイント:**
- `sqliteTable` を使用（SQLite）
- `integer().primaryKey({ autoIncrement: true })` で自動採番
- `references()` で外部キー制約
- `$inferSelect` / `$inferInsert` で型推論

**テーブル定義:**
```typescript
// カテゴリマスタ
export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
});

// 商品マスタ
export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price"),
  stock: integer("stock").default(0).notNull(),
  publishedDate: text("published_date"),
});

// 商品-カテゴリ中間テーブル
export const productCategories = sqliteTable("product_categories", {
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
});

// 顧客マスタ
export const customers = sqliteTable("customers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").unique(),
  memberNumber: text("member_number").unique(),
});

// 販売ヘッダー
export const saleHeaders = sqliteTable("sale_headers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  customerId: integer("customer_id")
    .notNull()
    .references(() => customers.id),
  saleDate: text("sale_date").notNull(),
});

// 販売明細
export const sales = sqliteTable("sales", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  saleHeaderId: integer("sale_header_id")
    .notNull()
    .references(() => saleHeaders.id, { onDelete: "cascade" }),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  quantity: integer("quantity").notNull(),
  salePrice: integer("sale_price").notNull(),
});
```

### 3. Drizzle 設定ファイル作成

**ファイル:** `nextjs/drizzle/config.ts`

```typescript
import type { Config } from "drizzle-kit";

export default {
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: "file:./bookstore.db",
  },
} satisfies Config;
```

**設定項目:**
- `schema`: スキーマファイルのパス
- `out`: マイグレーションファイルの出力先
- `dialect`: "sqlite" を指定
- `dbCredentials`: データベース接続情報

### 4. DB クライアント作成

**ファイル:** `nextjs/lib/db.ts`

```typescript
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "../drizzle/schema";

const sqlite = new Database("bookstore.db");
export const db = drizzle(sqlite, { schema });
```

## 生成されたファイル構造

```
nextjs/
├── drizzle/
│   ├── schema.ts           # DBスキーマ定義
│   ├── config.ts           # Drizzle設定
│   └── migrations/
│       └── .gitkeep        # マイグレーションファイル用
└── lib/
    └── db.ts              # DBクライアント
```

## Drizzle ORM の基本使用例

```typescript
import { db } from "@/lib/db";
import { customers, products, sales } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

// 全件取得
const allCustomers = await db.select().from(customers);

// 条件指定
const customer = await db.select().from(customers).where(eq(customers.id, 1));

// 挿入
await db.insert(customers).values({
  name: "山田太郎",
  email: "yamada@example.com",
  memberNumber: "M000001",
});

// 更新
await db.update(customers)
  .set({ email: "newemail@example.com" })
  .where(eq(customers.id, 1));

// 削除
await db.delete(customers).where(eq(customers.id, 1));

// ジョイン（販売ヘッダー + 顧客）
const saleWithCustomer = await db
  .select({
    saleId: saleHeaders.id,
    saleDate: saleHeaders.saleDate,
    customerName: customers.name,
  })
  .from(saleHeaders)
  .innerJoin(customers, eq(saleHeaders.customerId, customers.id));
```

## 次のステップ

Step 4: マイグレーション + データ初期化
