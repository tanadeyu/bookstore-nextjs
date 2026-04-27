import { db } from "@/lib/db";
import { products, categories, productCategories } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

async function getProducts() {
  const allProducts = await db.select().from(products).orderBy(products.id);

  // 各商品のカテゴリを取得
  const productsWithCategories = await Promise.all(
    allProducts.map(async (product) => {
      const cats = await db
        .select({ name: categories.name })
        .from(categories)
        .innerJoin(productCategories, eq(categories.id, productCategories.categoryId))
        .where(eq(productCategories.productId, product.id));

      return {
        ...product,
        categories: cats.map((c) => c.name),
      };
    })
  );

  return productsWithCategories;
}

export default async function ProductsPage() {
  const productList = await getProducts();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">商品一覧</h1>

      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-400">
        <table className="min-w-full divide-y divide-gray-400">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">商品名</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">説明</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">価格</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">在庫</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">カテゴリ</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {productList.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{product.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  {product.price ? `¥${product.price.toLocaleString()}` : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{product.stock}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {(product as any).categories?.join(", ") || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {productList.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          商品が登録されていません
        </div>
      )}
    </div>
  );
}
