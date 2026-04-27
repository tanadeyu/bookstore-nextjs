import { db } from "@/lib/db";
import { saleHeaders, sales, customers, products } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const headers = await db
    .select({
      id: saleHeaders.id,
      saleDate: saleHeaders.saleDate,
      customerId: saleHeaders.customerId,
      customerName: customers.name,
    })
    .from(saleHeaders)
    .innerJoin(customers, eq(saleHeaders.customerId, customers.id))
    .orderBy(saleHeaders.id);

  // 各販売の合計金額を計算
  const result = await Promise.all(
    headers.map(async (header) => {
      const items = await db
        .select({
          quantity: sales.quantity,
          salePrice: sales.salePrice,
        })
        .from(sales)
        .where(eq(sales.saleHeaderId, header.id));

      const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.salePrice, 0);

      return {
        ...header,
        totalAmount,
      };
    })
  );

  return NextResponse.json(result);
}
