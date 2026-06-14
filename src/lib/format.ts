import type { HealthStatus, LogType } from "@prisma/client";

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function formatDateTime(date: Date | string): string {
  return dateTimeFormatter.format(new Date(date));
}

export function formatDate(date: Date | string): string {
  return dateFormatter.format(new Date(date));
}

export const LOG_TYPE_LABELS: Record<LogType, string> = {
  WATERING: "Rega",
  HEALTH: "Saúde",
  NOTE: "Anotação",
  FERTILIZE: "Adubação",
};

export const LOG_TYPE_EMOJI: Record<LogType, string> = {
  WATERING: "💧",
  HEALTH: "🩺",
  NOTE: "📝",
  FERTILIZE: "🌱",
};

export const HEALTH_STATUS_LABELS: Record<HealthStatus, string> = {
  HEALTHY: "Saudável",
  ATTENTION: "Atenção",
  SICK: "Doente",
};
