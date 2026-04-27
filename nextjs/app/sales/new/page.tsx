"use client";

import { getCustomersForSelect, getProductsForSelect, createSale } from "../actions";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface Customer {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
}

interface SaleItem {
  productId: number;
  quantity: number;
}

export default function NewSalePage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [custData, prodData] = await Promise.all([
        getCustomersForSelect(),
        getProductsForSelect(),
      ]);
      setCustomers(custData as Customer[]);
      setProducts(prodData as Product[]);
      setLoading(false);
    }
    loadData();
  }, []);

  async function handleSubmit(formData: FormData) {
    const items: SaleItem[] = [];

    for (let i = 1; i <= 3; i++) {
      const productId = formData.get(`productId${i}`);
      const quantity = formData.get(`quantity${i}`);

      if (productId && productId !== "0" && quantity && Number(quantity) > 0) {
        items.push({
          productId: Number(productId),
          quantity: Number(quantity),
        });
      }
    }

    if (items.length === 0) {
      alert("商品を少なくとも1つ選択してください");
      return;
    }

    formData.set("items", JSON.stringify(items));

    const result = await createSale(formData);
    if (result.success) {
      window.location.href = "/sales";
    }
  }

  if (loading) {
    return <div className="p-8">読み込み中...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">販売登録</h1>

      <form action={handleSubmit}>
        <div className="bg-white shadow rounded-lg p-6 mb-6 border border-gray-400">
          <h2 className="text-xl font-semibold mb-4">ヘッダー情報</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">販売日</label>
              <input
                type="date"
                name="saleDate"
                required
                defaultValue={new Date().toISOString().split("T")[0]}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">顧客</label>
              <select
                name="customerId"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">選択してください</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white shadow rounded-lg p-6 mb-4 border border-gray-400">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">商品{i}</label>
                <select
                  name={`productId${i}`}
                  defaultValue="0"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="0">（選択しない）</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (¥{p.price})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">数量</label>
                <input
                  type="number"
                  name={`quantity${i}`}
                  min="0"
                  defaultValue="0"
                  placeholder="数量"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-end gap-4">
          <a href="/sales">
            <button
              type="button"
              className="h-9 px-4 py-2 text-sm border border-gray-700 rounded-md text-gray-700 hover:bg-gray-100"
            >
              キャンセル
            </button>
          </a>
          <button
            type="submit"
            className="h-9 px-4 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800"
          >
            登録
          </button>
        </div>
      </form>
    </div>
  );
}
