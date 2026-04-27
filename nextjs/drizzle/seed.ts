import { db } from "../lib/db";
import * as schema from "../drizzle/schema";

async function seed() {
  console.log("Seeding database...");

  // カテゴリ
  await db.insert(schema.categories).values([
    { name: "小説" },
    { name: "ビジネス書" },
    { name: "コミック" },
    { name: "雑誌" },
    { name: "教育・参考書" },
  ]);
  console.log("✓ Categories inserted");

  // 商品
  await db.insert(schema.products).values([
    // 教育・参考書
    { name: "TypeScript入門", description: "TypeScriptの基礎", price: 2800, stock: 50 },
    { name: "Next.js実践ガイド", description: "Next.js 16対応", price: 3200, stock: 30 },
    { name: "Rustプログラミング", description: "Rust言語の入門書", price: 3000, stock: 50 },
    { name: "実践Rust入門", description: "Rustの実践的な使い方", price: 3500, stock: 30 },
    { name: "アクターモデル詳解", description: "並行処理の基礎", price: 2800, stock: 20 },
    { name: "Webアプリ開発", description: "Webアプリケーション開発入門", price: 3200, stock: 40 },
    // ビジネス書
    { name: "リーダブルコード", description: "良いコードを書くために", price: 2600, stock: 40 },
    { name: "データベース設計", description: "SQLと設計の基礎", price: 2500, stock: 60 },
    { name: "アルゴリズム図鑑", description: "図解で学ぶアルゴリズム", price: 2700, stock: 45 },
    { name: "デザインパターン", description: "デザインパターン入門", price: 3800, stock: 25 },
    // 小説
    { name: "星空の物語", description: "ファンタジー小説", price: 1200, stock: 100 },
    { name: "走る男", description: "友情と冒険の物語", price: 800, stock: 80 },
    // コミック
    { name: "冒険漫画 1巻", description: "海賊冒険のストーリー", price: 550, stock: 200 },
    { name: "魔法戦記 1巻", description: "魔法使いの戦い", price: 550, stock: 150 },
    // 雑誌
    { name: "プログラミング雑誌 6月号", description: "技術雑誌", price: 1500, stock: 30 },
    { name: "IT情報誌 6月号", description: "業界情報誌", price: 1400, stock: 25 },
  ]);
  console.log("✓ Products inserted");

  // 商品-カテゴリ紐付け
  await db.insert(schema.productCategories).values([
    // 教育・参考書
    { productId: 1, categoryId: 5 }, // TypeScript入門
    { productId: 2, categoryId: 5 }, // Next.js実践ガイド
    { productId: 3, categoryId: 5 }, // Rustプログラミング
    { productId: 4, categoryId: 5 }, // 実践Rust入門
    { productId: 5, categoryId: 5 }, // アクターモデル詳解
    { productId: 6, categoryId: 5 }, // Webアプリ開発
    // ビジネス書
    { productId: 7, categoryId: 2 }, // リーダブルコード
    { productId: 8, categoryId: 2 }, // データベース設計
    { productId: 9, categoryId: 2 }, // アルゴリズム図鑑
    { productId: 10, categoryId: 2 }, // デザインパターン
    // 小説
    { productId: 11, categoryId: 1 }, // 星空の物語
    { productId: 12, categoryId: 1 }, // 走る男
    // コミック
    { productId: 13, categoryId: 3 }, // 冒険漫画 1巻
    { productId: 14, categoryId: 3 }, // 魔法戦記 1巻
    // 雑誌
    { productId: 15, categoryId: 4 }, // プログラミング雑誌
    { productId: 16, categoryId: 4 }, // IT情報誌
  ]);
  console.log("✓ Product-Category relations inserted");

  // 顧客
  await db.insert(schema.customers).values([
    { name: "山田太郎", email: "yamada@example.com", memberNumber: "M000001" },
    { name: "佐藤花子", email: "hanako@example.com", memberNumber: "M000002" },
    { name: "鈴木一郎", email: "suzuki@example.com", memberNumber: "M000003" },
    { name: "田中美咲", email: "tanaka@example.com", memberNumber: "M000004" },
    { name: "伊藤健太", email: "ito@example.com", memberNumber: "M000005" },
  ]);
  console.log("✓ Customers inserted");

  // 販売ヘッダー
  const headers = await db.insert(schema.saleHeaders).values([
    { customerId: 1, saleDate: "2026-04-01" },
    { customerId: 2, saleDate: "2026-04-15" },
    { customerId: 3, saleDate: "2026-04-20" },
    { customerId: 4, saleDate: "2026-04-25" },
    { customerId: 5, saleDate: "2026-04-28" },
    { customerId: 1, saleDate: "2026-05-01" },
    { customerId: 2, saleDate: "2026-05-05" },
    { customerId: 3, saleDate: "2026-05-10" },
    { customerId: 4, saleDate: "2026-05-15" },
  ]).returning();
  console.log("✓ Sale headers inserted");

  // 販売明細
  await db.insert(schema.sales).values([
    // 販売1: 山田太郎（4/1）- TypeScript入門x2 + リーダブルコードx1 = 8200円
    { saleHeaderId: headers[0].id, productId: 1, quantity: 2, salePrice: 2800 },
    { saleHeaderId: headers[0].id, productId: 7, quantity: 1, salePrice: 2600 },
    // 販売2: 佐藤花子（4/15）- Rustプログラミングx2 = 6000円
    { saleHeaderId: headers[1].id, productId: 3, quantity: 2, salePrice: 3000 },
    // 販売3: 鈴木一郎（4/20）- Next.js実践ガイドx1 = 3200円
    { saleHeaderId: headers[2].id, productId: 2, quantity: 1, salePrice: 3200 },
    // 販売4: 田中美咲（4/25）- 実践Rust入門x3 = 10500円
    { saleHeaderId: headers[3].id, productId: 4, quantity: 3, salePrice: 3500 },
    // 販売5: 伊藤健太（4/28）- デザインパターンx2 = 7600円
    { saleHeaderId: headers[4].id, productId: 10, quantity: 2, salePrice: 3800 },
    // 販売6: 山田太郎（5/1）- Webアプリ開発x1 + データベース設計x1 = 5700円
    { saleHeaderId: headers[5].id, productId: 6, quantity: 1, salePrice: 3200 },
    { saleHeaderId: headers[5].id, productId: 8, quantity: 1, salePrice: 2500 },
    // 販売7: 佐藤花子（5/5）- アルゴリズム図鑑x2 = 5400円
    { saleHeaderId: headers[6].id, productId: 9, quantity: 2, salePrice: 2700 },
    // 販売8: 鈴木一郎（5/10）- 星空の物語x1 + 冒険漫画 1巻x2 = 1900円
    { saleHeaderId: headers[7].id, productId: 11, quantity: 1, salePrice: 1200 },
    { saleHeaderId: headers[7].id, productId: 13, quantity: 2, salePrice: 550 },
    // 販売9: 田中美咲（5/15）- プログラミング雑誌x1 = 1500円
    { saleHeaderId: headers[8].id, productId: 15, quantity: 1, salePrice: 1500 },
  ]);
  console.log("✓ Sales inserted");

  console.log("Seed data inserted successfully!");
}

seed().catch(console.error);
