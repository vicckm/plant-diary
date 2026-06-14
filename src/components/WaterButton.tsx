"use client";

import { useTransition } from "react";
import { waterNow } from "@/app/actions";

export function WaterButton({
  plantId,
  className,
}: {
  plantId: string;
  className?: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => waterNow(plantId))}
      className={
        className ??
        "inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
      }
    >
      <span aria-hidden>💧</span>
      {isPending ? "Registrando..." : "Reguei agora"}
    </button>
  );
}
