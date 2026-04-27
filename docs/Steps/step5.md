# Step 5: 基本レイアウト (Root Layout + Navigation)

**実施日**: 2026-04-27
**ステータス**: ✅ 完了

## 目的

ナビゲーション付きの基本レイアウトを作成する。

## 手順

### 1. ナビゲーションコンポーネント作成

**ファイル:** `nextjs/components/navigation.tsx`

```typescript
import Link from "next/link";

const navItems = [
  { href: "/", label: "ダッシュボード" },
  { href: "/products", label: "商品" },
  { href: "/customers", label: "顧客" },
  { href: "/sales", label: "販売" },
];

export function Navigation() {
  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16">
          <div className="flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex items-center px-4 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
```

### 2. Root Layout 更新

**ファイル:** `nextjs/app/layout.tsx`

```typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BookStore",
  description: "商品販売データ分析システム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}
```

### 3. 各ページのプレースホルダー作成

**商品一覧:** `nextjs/app/products/page.tsx`

```typescript
export default function ProductsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold">商品一覧</h1>
      <p>商品マスタの閲覧・管理</p>
    </div>
  );
}
```

**顧客一覧:** `nextjs/app/customers/page.tsx`

```typescript
export default function CustomersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold">顧客一覧</h1>
      <p>顧客マスタの閲覧・管理</p>
    </div>
  );
}
```

**販売一覧:** `nextjs/app/sales/page.tsx`

```typescript
export default function SalesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold">販売一覧</h1>
      <p>販売データの閲覧・登録</p>
    </div>
  );
}
```

## 生成されたファイル構造

```
nextjs/
├── app/
│   ├── layout.tsx         # Root Layout（ナビゲーション追加）
│   ├── page.tsx           # ダッシュボード（既存）
│   ├── products/
│   │   └── page.tsx       # 商品一覧
│   ├── customers/
│   │   └── page.tsx       # 顧客一覧
│   └── sales/
│       └── page.tsx       # 販売一覧
└── components/
    └── navigation.tsx     # ナビゲーションコンポーネント
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

Step 6: ダッシュボード (ランキング、集計)
