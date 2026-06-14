"use client";

import { useTransition } from "react";
import { deletePlant } from "@/app/actions";

export function DeletePlantButton({ plantId }: { plantId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (confirm("Excluir esta planta e todos os registros?")) {
          startTransition(() => deletePlant(plantId));
        }
      }}
      className="rounded-full border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60 dark:border-red-900 dark:hover:bg-red-950"
    >
      {isPending ? "Excluindo..." : "Excluir"}
    </button>
  );
}
