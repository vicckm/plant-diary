"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { HealthStatus, LogType } from "@prisma/client";
import { prisma } from "@/lib/db";
import { saveUploadedImage } from "@/lib/uploads";

type CreatePlantState = {
  error?: string;
  success?: boolean;
};

const LOG_TYPES: LogType[] = ["WATERING", "HEALTH", "NOTE", "FERTILIZE"];
const HEALTH_STATUSES: HealthStatus[] = ["HEALTHY", "ATTENTION", "SICK"];

function str(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function createPlant(
  prevState: CreatePlantState,
  formData: FormData
): Promise<CreatePlantState> {
  try {
    const name = str(formData.get("name"));
    if (!name) return { error: "O nome da planta é obrigatório." };

    const intervalRaw = Number(formData.get("wateringIntervalDays"));
    const wateringIntervalDays =
      Number.isFinite(intervalRaw) && intervalRaw > 0
        ? Math.round(intervalRaw)
        : 7;

    const coverPhotoUrl = await saveUploadedImage(formData.get("photo"));

    const plant = await prisma.plant.create({
      data: {
        name,
        nickname: str(formData.get("nickname")),
        species: str(formData.get("species")),
        location: str(formData.get("location")),
        wateringIntervalDays,
        coverPhotoUrl,
      },
    });

    revalidatePath("/");
    redirect(`/plants/${plant.id}`);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao criar planta.";
    return { error: message };
  }
}

export async function addLog(
  plantId: string,
  formData: FormData
): Promise<{ error?: string }> {
  try {
    const plant = await prisma.plant.findUnique({ where: { id: plantId } });
    if (!plant) return { error: "Planta não encontrada." };

    const typeRaw = formData.get("type");
    const type: LogType =
      typeof typeRaw === "string" && LOG_TYPES.includes(typeRaw as LogType)
        ? (typeRaw as LogType)
        : "NOTE";

    const healthRaw = formData.get("healthStatus");
    const healthStatus: HealthStatus | null =
      type === "HEALTH" &&
      typeof healthRaw === "string" &&
      HEALTH_STATUSES.includes(healthRaw as HealthStatus)
        ? (healthRaw as HealthStatus)
        : null;

    const photoUrl = await saveUploadedImage(formData.get("photo"));

    await prisma.logEntry.create({
      data: {
        plantId,
        type,
        note: str(formData.get("note")),
        healthStatus,
        photoUrl,
      },
    });

    revalidatePath(`/plants/${plantId}`);
    revalidatePath("/");
    return {};
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao adicionar registro.";
    return { error: message };
  }
}

/** Quick "I watered now" action used by cards and the detail page. */
export async function waterNow(plantId: string): Promise<void> {
  await prisma.logEntry.create({
    data: { plantId, type: "WATERING" },
  });
  revalidatePath(`/plants/${plantId}`);
  revalidatePath("/");
}

export async function deletePlant(plantId: string): Promise<void> {
  await prisma.plant.delete({ where: { id: plantId } });
  revalidatePath("/");
  redirect("/");
}
