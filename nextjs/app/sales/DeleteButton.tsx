"use client";

import { deleteSale } from "./actions";

interface DeleteButtonProps {
  id: number;
  redirectPath?: string;
}

export function DeleteButton({ id, redirectPath = "/sales" }: DeleteButtonProps) {
  async function handleDelete() {
    if (!confirm("この販売データを削除しますか？")) {
      return;
    }

    await deleteSale(id);
    window.location.href = redirectPath;
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="px-4 py-2 text-sm border border-red-600 rounded-md text-red-600 hover:bg-red-50"
    >
      削除
    </button>
  );
}
