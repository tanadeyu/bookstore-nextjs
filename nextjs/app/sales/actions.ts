"use server";

import { db } from "@/lib/db";
import { saleHeaders, sales, customers, products } from "@/drizzle/schema";
import { revalidatePath } from "next/cache";
import { eq, sql } from "drizzle-orm";

export type SaleItem = {
  productId: number;
  quantity: number;
};

export async function createSale(formData: FormData) {
  const customerId = Number(formData.get("customerId"));
  const saleDate = formData.get("saleDate") as string;
  const itemsJson = formData.get("items") as string;
  const items: SaleItem[] = JSON.parse(itemsJson);

  // トランザクション外で商品情報を取得
  const productInfo = new Map<number, { price: number; stock: number }>();
  for (const item of items) {
    const [product] = await db
      .select({ price: products.price, stock: products.stock })
      .from(products)
      .where(eq(products.id, item.productId))
      .limit(1);

    if (!product) {
      throw new Error(`商品ID ${item.productId} が見つかりません`);
    }
    productInfo.set(item.productId, { price: product.price, stock: product.stock });
  }

  // 在庫チェック
  for (const item of items) {
    const info = productInfo.get(item.productId)!;
    if (info.stock < item.quantity) {
      throw new Error(`${item.productId}番の商品の在庫が不足しています`);
    }
  }

  // ヘッダー登録
  const [header] = await db
    .insert(saleHeaders)
    .values({
      customerId,
      saleDate,
    })
    .returning();

  // 在庫を減らす + 明細登録
  for (const item of items) {
    const info = productInfo.get(item.productId)!;

    // 在庫を減らす（現在の在庫を取得して減算）
    await db
      .update(products)
      .set({ stock: sql`${products.stock} - ${item.quantity}` })
      .where(eq(products.id, item.productId));

    // 明細登録
    await db.insert(sales).values({
      saleHeaderId: header.id,
      productId: item.productId,
      quantity: item.quantity,
      salePrice: info.price,
    });
  }

  revalidatePath("/sales");

  return { success: true, saleId: header.id };
}

export async function getCustomersForSelect() {
  return db.select().from(customers);
}

export async function getProductsForSelect() {
  return db.select().from(products);
}

export async function deleteSale(id: number) {
  // 明細を削除
  await db.delete(sales).where(eq(sales.saleHeaderId, id));
  // ヘッダーを削除
  await db.delete(saleHeaders).where(eq(saleHeaders.id, id));

  revalidatePath("/sales");
}
