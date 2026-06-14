"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export interface ReminderPlant {
  id: string;
  name: string;
  label: string;
  overdue: boolean;
}

export function WateringReminders({ plants }: { plants: ReminderPlant[] }) {
  const [permission, setPermission] = useState(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return "unsupported";
    }

    return Notification.permission;
  });

  useEffect(() => {
    if (!("Notification" in window)) return;

    if (permission !== "granted" || plants.length === 0) return;

    const names = plants.map((p) => p.name).join(", ");

    new Notification("Hora de regar! 💧", {
      body:
        plants.length === 1
          ? `${names} precisa de água.`
          : `${plants.length} plantas precisam de água: ${names}`,
      icon: "/favicon.ico",
    });
  }, [permission, plants]);

  async function requestPermission() {
    if (!("Notification" in window)) return;

    const result = await Notification.requestPermission();

    setPermission(result);
  }

  if (plants.length === 0) {
    return (
      <aside
        role="status"
        aria-live="polite"
        className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300"
      >
        <p>🌿 Tudo em dia! Nenhuma planta precisa de água hoje.</p>
      </aside>
    );
  }

  return (
    <aside
      aria-label="Lembretes de rega"
      className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/40"
    >
      <section className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-semibold text-amber-900 dark:text-amber-200">
          💧 {plants.length} planta(s) precisam de água
        </h2>
        {permission === "default" && (
          <button
            type="button"
            onClick={requestPermission}
            className="rounded-full border border-amber-400 px-3 py-1 text-xs font-medium text-amber-900 hover:bg-amber-100 dark:text-amber-200 dark:hover:bg-amber-900/40"
          >
            Ativar notificações
          </button>
        )}
        {permission === "denied" && (
          <span className="text-xs text-amber-700 dark:text-amber-300">
            Notificações bloqueadas no navegador
          </span>
        )}
      </section>

      <ul aria-label="Plantas que precisam de àgua" className="mt-2 flex flex-wrap gap-2">
        {plants.map((p) => (
          <li key={p.id}>
            <Link
              href={`/plants/${p.id}`}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm ${p.overdue
                ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                : "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200"
                }`}
            >
              {p.name} · {p.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
