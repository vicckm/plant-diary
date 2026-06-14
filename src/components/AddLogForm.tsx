"use client";

import { useActionState, useRef, useState } from "react";
import type { LogType } from "@prisma/client";
import { addLog } from "@/app/actions";
import { LOG_TYPE_EMOJI, LOG_TYPE_LABELS } from "@/lib/format";
import { SubmitButton } from "./SubmitButton";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";

const LOG_TYPES: LogType[] = ["WATERING", "HEALTH", "NOTE", "FERTILIZE"];

type ActionState = {
  error?: string;
};

export function AddLogForm({ plantId }: { plantId: string }) {
  const [type, setType] = useState<LogType>("WATERING");
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(

    async (_previousState: ActionState, formData: FormData) => {
      const result = await addLog(plantId, formData);

      if (!result.error) {
        formRef.current?.reset();
        setType("WATERING");
      }
      return result;
    },
    { error: undefined }
  );

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-4 rounded-2xl border border-border bg-card p-4"
    >
      <h3 className="font-semibold">Novo registro</h3>

      {state.error && (
        <div
          className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
          role="alert"
          aria-live="polite"
        >
          {state.error}
        </div>
      )}

      <fieldset disabled={isPending}>
        <legend className="mb-1.5 text-sm font-medium">Tipo de registro</legend>
        <div className="flex flex-wrap gap-2">
          {LOG_TYPES.map((t) => (
            <label
              key={t}
              className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm transition ${type === t
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background"
                } ${isPending ? "opacity-50" : ""}`}
            >
              <input
                type="radio"
                name="type"
                value={t}
                checked={type === t}
                onChange={() => setType(t)}
                className="sr-only"
                disabled={isPending}
              />
              <span aria-hidden="true">{LOG_TYPE_EMOJI[t]}</span>
              {LOG_TYPE_LABELS[t]}
            </label>
          ))}
        </div>
      </fieldset>

      {type === "HEALTH" && (
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="healthStatus">
            Estado de saude
          </label>
          <select
            id="healthStatus"
            name="healthStatus"
            className={inputClass}
            defaultValue="HEALTHY"
            disabled={isPending}
          >
            <option value="HEALTHY">Saudavel</option>
            <option value="ATTENTION">Atencao</option>
            <option value="SICK">Doente</option>
          </select>
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="note">
          Anotacao
        </label>
        <textarea
          id="note"
          name="note"
          rows={2}
          className={inputClass}
          placeholder="Ex: folhas amareladas perto da base"
          disabled={isPending}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="log-photo">
          Foto (opcional)
        </label>
        <input
          id="log-photo"
          name="photo"
          type="file"
          accept="image/*"
          className="block w-full text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground disabled:opacity-50"
          disabled={isPending}
        />
      </div>

      <SubmitButton pendingLabel="Adicionando...">
        Adicionar registro
      </SubmitButton>
    </form>
  );
}
