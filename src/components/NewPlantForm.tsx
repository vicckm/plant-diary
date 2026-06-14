"use client";

import { useActionState, useState } from "react";
import { createPlant } from "@/app/actions";
import { SubmitButton } from "./SubmitButton";
import Image from "next/image";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";
const labelClass = "mb-1 block text-sm font-medium";

export function NewPlantForm() {
  const [preview, setPreview] = useState<string | null>(null);
  const [state, formAction, isPending] = useActionState(
    createPlant,
    {
      error: undefined,
      success: false
    }
  );

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <section
          className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
          role="alert"
          aria-live="polite"
        >
          {state.error}
        </section>
      )}

      <section>
        <label className={labelClass} htmlFor="name">
          Nome *
        </label>
        <input
          id="name"
          name="name"
          required
          className={inputClass}
          placeholder="Costela-de-adao"
          disabled={isPending}
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="nickname">
            Apelido
          </label>
          <input
            id="nickname"
            name="nickname"
            className={inputClass}
            placeholder="Costelinha"
            disabled={isPending}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="species">
            Especie
          </label>
          <input
            id="species"
            name="species"
            className={inputClass}
            placeholder="Monstera deliciosa"
            disabled={isPending}
          />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="location">
            Local
          </label>
          <input
            id="location"
            name="location"
            className={inputClass}
            placeholder="Sala / varanda"
            disabled={isPending}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="wateringIntervalDays">
            Regar a cada (dias)
          </label>
          <input
            id="wateringIntervalDays"
            name="wateringIntervalDays"
            type="number"
            min={1}
            defaultValue={7}
            className={inputClass}
            disabled={isPending}
          />
        </div>
      </section>

      <section>
        <label className={labelClass} htmlFor="photo">
          Foto de capa
        </label>
        <input
          id="photo"
          name="photo"
          type="file"
          accept="image/*"
          className="block w-full text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground disabled:opacity-50"
          onChange={(e) => {
            const file = e.target.files?.[0];
            setPreview(file ? URL.createObjectURL(file) : null);
          }}
          disabled={isPending}
        />
        {preview && (
          <Image
            src={preview}
            alt="Pré-visualização"
            width={400}
            height={300}
            className="mt-3 h-40 w-40 rounded-lg object-cover"
          />
        )}
      </section>

      <section className="pt-2">
        <SubmitButton pendingLabel="Cadastrando..." disabled={isPending}>
          Cadastrar planta
        </SubmitButton>
      </section>
    </form>
  );
}
