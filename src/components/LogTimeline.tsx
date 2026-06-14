import type { LogEntry } from "@prisma/client";
import { formatDateTime, LOG_TYPE_EMOJI, LOG_TYPE_LABELS } from "@/lib/format";
import { HealthBadge } from "./HealthBadge";

export function LogTimeline({ logs }: { logs: LogEntry[] }) {
  if (logs.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted">
        Nenhum registro ainda. Adicione a primeira rega ou anotacao.
      </p>
    );
  }

  return (
    <ol className="space-y-3">
      {logs.map((log) => (
        <li
          key={log.id}
          className="flex gap-3 rounded-2xl border border-border bg-card p-4"
        >
          <span className="text-2xl" aria-hidden="true">
            {LOG_TYPE_EMOJI[log.type]}
          </span>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium">{LOG_TYPE_LABELS[log.type]}</span>
              {log.healthStatus && <HealthBadge status={log.healthStatus} />}
              <time
                className="ml-auto text-xs text-muted"
                dateTime={new Date(log.createdAt).toISOString()}
              >
                {formatDateTime(log.createdAt)}
              </time>
            </div>
            {log.note && <p className="mt-1 text-sm">{log.note}</p>}
            {log.photoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={log.photoUrl}
                alt="Foto do registro"
                className="mt-2 max-h-64 rounded-lg object-cover"
              />
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
