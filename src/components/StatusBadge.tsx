import type { WateringInfo } from "@/lib/watering";
import { wateringStatusLabel } from "@/lib/watering";

const STYLES: Record<string, string> = {
  overdue: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  "due-today": "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  ok: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  unknown: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
};

export function StatusBadge({ info }: { info: WateringInfo }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${STYLES[info.status]}`}
    >
      <span aria-hidden>💧</span>
      {wateringStatusLabel(info)}
    </span>
  );
}
