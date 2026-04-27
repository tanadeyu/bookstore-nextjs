# Next.js版 Step 構成

**更新日**: 2026-04-27

Rust版（12Step）をNext.jsで再構成。

## Step 一覧

| Step | 内容 | Rust版対応 |
|------|------|-----------|
| Step 1 | プロジェクト作成 | Step 1-5 |
| Step 2 | 依存関係追加 (Drizzle, shadcn/ui) | Step 2-3 |
| Step 3 | データベーススキーマ定義 | Step 4 |
| Step 4 | マイグレーション + データ初期化 | Step 5 |
| Step 5 | 基本レイアウト (Root Layout + Navigation) | Step 11 |
| Step 6 | ダッシュボード (ランキング、集計) | Step 9-10 + Step 11 |
| Step 7 | 商品管理ページ | Step 6 + Step 11 |
| Step 8 | 顧客管理ページ | Step 7 + Step 11 |
| Step 9 | 販売管理ページ (一覧 + 詳細) | Step 8 + Step 11 |
| Step 10 | 販売登録フォーム (Server Actions + トランザクション) | Step 12 |

## 違い

| 項目 | Rust版 | Next.js版 |
|------|--------|-----------|
| ルーティング | Actix Web | App Router (ファイルベース) |
| テンプレート | Askama (Rustマクロ) | React Server Components |
| API | 別ハンドラー | Server Actions / API Routes |
| UI | 生HTML/CSS | shadcn/ui + Tailwind CSS |
| フォーム | POST + web::Form | Server Actions |

