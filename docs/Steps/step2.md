# Step 2: 依存関係追加 (Drizzle, shadcn/ui)

**実施日**: 2026-04-27
**ステータス**: ✅ 完了

## 目的

データベース操作（Drizzle ORM + SQLite）とUIコンポーネント（shadcn/ui）の依存関係を追加する。

## 手順

### 1. Drizzle ORM & SQLite インストール

```bash
cd nextjs
npm install drizzle-orm better-sqlite3
npm install -D drizzle-kit
```

**パッケージ説明:**
- `drizzle-orm`: ORM 本体
- `better-sqlite3`: SQLite クライアント
- `drizzle-kit`: マイグレーションツール（devDependency）

### 2. shadcn/ui 初期化

```bash
cd nextjs
npx shadcn@latest init --yes --defaults
```

**オプション説明:**
- `--yes`: 確認プロンプトをスキップ
- `--defaults`: デフォルト設定を使用

**Git Bash での注意:**
- `-y` 単独では対話モードがスキップされない場合がある
- `--yes --defaults` の組み合わせで完全に非対話モードになる

### 3. 実行結果

```
✔ Preflight checks.
✔ Verifying framework. Found Next.js.
✔ Validating Tailwind CSS. Found v4.
✔ Validating import alias.
✔ Writing components.json.
✔ Checking registry.
✔ Installing dependencies.
✔ Installing dependencies.
✔ Updating fonts.
✔ Updating files.
✔ Created 2 files:
  - components\ui\button.tsx
  - lib\utils.ts
✔ Updating app\globals.css

Project initialization completed.
```

## 生成されたファイル構造

```
nextjs/
├── components/
│   └── ui/
│       └── button.tsx        # shadcn/ui ボタンコンポーネント
├── lib/
│   └── utils.ts              # ユーティリティ関数（cn など）
├── components.json           # shadcn/ui 設定ファイル
└── app/
    └── globals.css           # 更新（shadcn/ui スタイル追加）
```

## インストール済みパッケージ

| パッケージ | 種類 |
|-----------|------|
| drizzle-orm | dependency |
| better-sqlite3 | dependency |
| drizzle-kit | devDependency |
| shadcn/ui | components |

## 確認コマンド

```bash
# インストール済みパッケージ確認
cd nextjs
npm list | grep -E "(drizzle|sqlite)"

# components.json が存在するか確認
cat components.json

# shadcn/ui コンポーネント追加テスト
npx shadcn@latest add card --yes
```

## 次のステップ

Step 3: データベーススキーマ定義
