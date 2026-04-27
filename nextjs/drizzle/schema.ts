import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

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

// 型エクスポート
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type ProductCategory = typeof productCategories.$inferSelect;
export type NewProductCategory = typeof productCategories.$inferInsert;

export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;

export type SaleHeader = typeof saleHeaders.$inferSelect;
export type NewSaleHeader = typeof saleHeaders.$inferInsert;

export type Sale = typeof sales.$inferSelect;
export type NewSale = typeof sales.$inferInsert;
