import type { HealthStatus } from "@prisma/client";
import { HEALTH_STATUS_LABELS } from "@/lib/format";

const STYLES: Record<HealthStatus, string> = {
  HEALTHY: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  ATTENTION: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  SICK: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

const EMOJI: Record<HealthStatus, string> = {
  HEALTHY: "✅",
  ATTENTION: "⚠️",
  SICK: "🚑",
};

export function HealthBadge({ status }: { status: HealthStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${STYLES[status]}`}
    >
      <span aria-hidden>{EMOJI[status]}</span>
      {HEALTH_STATUS_LABELS[status]}
    </span>
  );
}
