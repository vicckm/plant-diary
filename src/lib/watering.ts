import type { LogEntry, Plant } from "@prisma/client";

export type WateringStatus = "overdue" | "due-today" | "ok" | "unknown";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function diffInDays(from: Date, to: Date): number {
  return Math.round(
    (startOfDay(to).getTime() - startOfDay(from).getTime()) / MS_PER_DAY,
  );
}

/** Most recent watering log date, or null if the plant was never watered. */
export function lastWateringAt(logs: Pick<LogEntry, "type" | "createdAt">[]): Date | null {
  const watering = logs
    .filter((l) => l.type === "WATERING")
    .map((l) => new Date(l.createdAt))
    .sort((a, b) => b.getTime() - a.getTime());
  return watering[0] ?? null;
}

/** When the plant should next be watered, based on the last watering + interval. */
export function nextWateringAt(
  plant: Pick<Plant, "wateringIntervalDays" | "createdAt">,
  logs: Pick<LogEntry, "type" | "createdAt">[],
): Date {
  const base = lastWateringAt(logs) ?? new Date(plant.createdAt);
  const next = new Date(base);
  next.setDate(next.getDate() + plant.wateringIntervalDays);
  return next;
}

export interface WateringInfo {
  status: WateringStatus;
  nextWateringAt: Date;
  lastWateringAt: Date | null;
  /** Negative => overdue by N days, 0 => today, positive => in N days. */
  daysUntilNext: number;
}

export function getWateringInfo(
  plant: Pick<Plant, "wateringIntervalDays" | "createdAt">,
  logs: Pick<LogEntry, "type" | "createdAt">[],
  now: Date = new Date(),
): WateringInfo {
  const last = lastWateringAt(logs);
  const next = nextWateringAt(plant, logs);
  const daysUntilNext = diffInDays(now, next);

  let status: WateringStatus;

  if (daysUntilNext < 0) status = "overdue";
  else if (daysUntilNext === 0) status = "due-today";
  else status = "ok";

  return { status, nextWateringAt: next, lastWateringAt: last, daysUntilNext };
}

export function wateringStatusLabel(info: WateringInfo): string {
  switch (info.status) {
    case "overdue":
      return `Atrasada ${Math.abs(info.daysUntilNext)} dia(s)`;
    case "due-today":
      return "Regar hoje";
    case "ok":
      return `Em ${info.daysUntilNext} dia(s)`;
    default:
      return "Sem informação";
  }
}

export function needsWaterNow(info: WateringInfo): boolean {
  return info.status === "overdue" || info.status === "due-today";
}
