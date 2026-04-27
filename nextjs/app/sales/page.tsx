"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteSale } from "./actions";

interface SaleHeader {
  id: number;
  saleDate: string;
  customerId: number;
  customerName: string;
  totalAmount: number;
}

export default function SalesPage() {
  const [saleList, setSaleList] = useState<SaleHeader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const res = await fetch("/api/sales");
      const data = await res.json();
      setSaleList(data);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="p-8">読み込み中...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">販売一覧</h1>
        <a href="/sales/new">
          <Button>新規登録</Button>
        </a>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-400">
        <table className="min-w-full divide-y divide-gray-400">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">日付</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">顧客</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">合計金額</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {saleList.map((sale) => (
              <tr key={sale.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.saleDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sale.customerName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  ¥{sale.totalAmount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <div className="flex gap-2 justify-center items-center">
                    <a href={`/sales/${sale.id}`}>
                      <button
                        type="button"
                        className="px-4 py-2 text-sm border border-gray-700 rounded-md text-gray-700 hover:bg-gray-100"
                      >
                        詳細
                      </button>
                    </a>
                    <button
                      type="button"
                      onClick={async () => {
                        if (confirm("この販売データを削除しますか？")) {
                          await deleteSale(sale.id);
                          window.location.reload();
                        }
                      }}
                      className="px-4 py-2 text-sm border border-red-600 rounded-md text-red-600 hover:bg-red-50"
                    >
                      削除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {saleList.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          販売データが登録されていません
        </div>
      )}
    </div>
  );
}
