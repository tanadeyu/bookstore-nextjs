# Step 1: Next.js プロジェクト作成

**実施日**: 2026-04-27
**ステータス**: ✅ 完了

## 目的

nextjs/ サブフォルダに Next.js 16 プロジェクトを作成する。

## 手順

### プロジェクト作成

```bash
cd bookstore-nextjs
mkdir nextjs
cd nextjs
npx create-next-app@latest . --typescript --tailwind --eslint --app --yes
```

**オプション:**
- `--typescript`: TypeScript使用
- `--tailwind`: Tailwind CSS使用
- `--eslint`: ESLint使用
- `--app`: App Router使用
- `--yes`: 対話モードをスキップ（デフォルト設定を適用）

### 実行結果

```
Success! Created nextjs at C:\Users\hello\Desktop\project\bookstore-nextjs\nextjs

Installing dependencies:
- next
- react
- react-dom

Installing devDependencies:
- @tailwindcss/postcss
- @types/node
- @types/react
- @types/react-dom
- eslint
- eslint-config-next
- tailwindcss
- typescript
```

**インストールされたバージョン:**
- Next.js 16.2.4
- React 19.x
- TypeScript 5.x

## 生成されたファイル構造

```
nextjs/
├── .git/
├── .gitignore
├── .next/
├── app/                 # App Router ページ
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── public/              # 静的ファイル
├── components/          # React コンポーネント
├── lib/                 # ユーティリティ
├── package.json         # パッケージ設定
├── package-lock.json    # ロックファイル
├── next.config.ts       # Next.js 設定
├── tsconfig.json        # TypeScript 設定
└── eslint.config.mjs    # ESLint 設定
```

## 確認コマンド

```bash
# 開発サーバー起動
cd nextjs
npm run dev

# ブラウザで確認
# http://localhost:3000
```

## 次のステップ

Step 2: 依存関係追加 (Drizzle, shadcn/ui)
