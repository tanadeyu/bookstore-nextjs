# BookStore-Next Project Notes

## Tech Stack

| 項目 | 技術 |
|------|------|
| フレームワーク | Next.js 16 App Router (TypeScript) |
| ORM | Drizzle ORM |
| データベース | SQLite (better-sqlite3) |
| UI | shadcn/ui + Tailwind CSS |

## Project Structure

```
bookstore-nextjs/
├── CLAUDE.md             # プロジェクトノート
├── docs/                 # ドキュメント
├── log.md                # 開発ログ
├── README.md             # プロジェクト説明
├── Reference/            # Rust版参考コード
└── nextjs/               # Next.js プロジェクト
    ├── app/              # App Router
    │   ├── (dashboard)/  # ダッシュボードグループ
    │   ├── api/          # API Routes
    │   ├── customers/    # 顧客管理
    │   ├── products/     # 商品管理
    │   └── sales/        # 販売管理
    ├── components/       # Reactコンポーネント
    │   └── ui/          # shadcn/uiコンポーネント
    ├── lib/             # ユーティリティ
    │   └── db.ts       # Drizzleクライアント
    ├── drizzle/        # Drizzle設定
    │   ├── config.ts
    │   └── schema.ts   # DBスキーマ定義
    └── package.json
```

## Database Schema

SQLite互換のデータベース設計（既存Rust版を参考）

```
customers (顧客マスタ)
  ↓ 1:N
sale_headers (販売ヘッダー)
  ↓ 1:N
sales (販売明細)
  ↓ N:1
products (商品マスタ) ←→ categories (カテゴリマスタ)
```

## Development Notes

- TypeScript厳格モード使用
- Server Actionsでフォーム処理
- Server Components優先（クライアントコンポーネントは必要時のみ）
- データベース: SQLite ファイル (`bookstore.db`)

## 開発ルール

- **ドキュメント更新を優先**: 開発を進める前に、必ずドキュメント（docs/Steps/, log.md）を更新する
- **ドキュメントなしで開発禁止**: ドキュメント更新なしで勝手に開発を進めない

## 進捗状況

### Step 10: 販売登録フォーム ✅ 完了

**実装ファイル:**
- `nextjs/app/sales/actions.ts` - Server Actions（在庫管理付き）
- `nextjs/app/sales/new/page.tsx` - 販売登録ページ（固定3行）
- `nextjs/app/sales/DeleteButton.tsx` - 削除ボタン
- `nextjs/app/sales/page.tsx` - 一覧ページ（「新規登録」「削除」ボタン）
- `nextjs/app/api/sales/route.ts` - API Route

**機能:**
- 固定3行フォーム（Reference版準拠）
- 顧客選択、販売日入力
- 商品選択時に価格表示（単価は商品マスタから自動取得）
- 在庫チェック（在庫不足時はエラー）
- 販売登録時に在庫を減算
- 販売削除機能（一覧ページのみ）

**カテゴリ構成（Reference版準拠）:**
- 小説、ビジネス書、コミック、雑誌、教育・参考書（5カテゴリ）

**商品データ:**
- 16件（全カテゴリに商品あり）

**販売データ:**
- 9件（全カテゴリの販売あり）

**UI調整:**
- ボタン枠線濃く（gray-700, red-600）
- テーブル境界線濃く（divide-gray-400）
- テーブルヘッダー背景（bg-gray-100）
- カード境界線追加（border-gray-400）
- ページ幅統一（max-w-4xl）
