# Step 4: マイグレーション + データ初期化

**実施日**: 2026-04-27
**ステータス**: ✅ 完了

## 目的

Drizzle Kit でマイグレーションを生成・実行し、初期データを投入する。

## 手順

### 1. マイグレーション生成

```bash
cd nextjs
npx drizzle-kit generate --config=drizzle/config.ts
```

**生成されるファイル:**
- `drizzle/migrations/0001_*.sql` - マイグレーション SQL ファイル

### 2. マイグレーション実行

```bash
cd nextjs
npx drizzle-kit push --config=drizzle/config.ts
```

**実行結果:**
- `bookstore.db` が作成される
- 全テーブルが作成される

### 3. 初期データ投入

**ファイル:** `nextjs/drizzle/seed.ts`

```typescript
import { db } from "../lib/db";
import * as schema from "../drizzle/schema";

async function seed() {
  // カテゴリ
  await db.insert(schema.categories).values([
    { name: "小説" },
    { name: "ビジネス" },
    { name: "技術" },
    { name: "コミック" },
  ]);

  // 商品
  await db.insert(schema.products).values([
    { name: "TypeScript入門", description: "TypeScriptの基礎", price: 2800, stock: 50 },
    { name: "Next.js実践ガイド", description: "Next.js 16対応", price: 3200, stock: 30 },
    { name: "リーダブルコード", description: "良いコードを書くために", price: 2600, stock: 40 },
  ]);

  // 顧客
  await db.insert(schema.customers).values([
    { name: "山田太郎", email: "yamada@example.com", memberNumber: "M000001" },
    { name: "佐藤花子", email: "hanako@example.com", memberNumber: "M000002" },
    { name: "鈴木一郎", email: "suzuki@example.com" },
  ]);

  console.log("Seed data inserted successfully");
}

seed().catch(console.error);
```

**実行コマンド:**
```bash
cd nextjs
npx tsx drizzle/seed.ts
```

## 生成されるファイル構造

```
nextjs/
├── bookstore.db           # SQLite データベースファイル
├── drizzle/
│   ├── schema.ts
│   ├── config.ts
│   ├── seed.ts           # 初期データスクリプト
│   └── migrations/
│       └── 0001_*.sql    # マイグレーションファイル
└── lib/
    └── db.ts
```

## 確認コマンド

```bash
# Drizzle Studio でデータベースを確認
cd nextjs
npx drizzle-kit studio

# データベースファイルを確認
ls -la bookstore.db
```

## 次のステップ

Step 5: 基本レイアウト (Root Layout + Navigation)
