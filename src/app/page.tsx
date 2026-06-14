import Link from "next/link";
import { prisma } from "@/lib/db";
import { getWateringInfo, needsWaterNow, wateringStatusLabel } from "@/lib/watering";
import { PlantCard } from "@/components/PlantCard";
import {
  WateringReminders,
  type ReminderPlant,
} from "@/components/WateringReminders";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const plants = await prisma.plant.findMany({
    orderBy: { createdAt: "asc" },
    include: { logs: { orderBy: { createdAt: "desc" } } },
  });

  const reminders: ReminderPlant[] = plants
    .map((plant) => ({ plant, info: getWateringInfo(plant, plant.logs) }))
    .filter(({ info }) => needsWaterNow(info))
    .sort((a, b) => a.info.daysUntilNext - b.info.daysUntilNext)
    .map(({ plant, info }) => ({
      id: plant.id,
      name: plant.name,
      label: wateringStatusLabel(info),
      overdue: info.status === "overdue",
    }));

  return (
    <section aria-labelledby="page-heading" className="space-y-6">
      <hgroup>
        <h1 id="page-heading" className="text-2xl font-bold">Minhas plantas</h1>
        <p className="text-muted">{plants.length} planta(s) no diário.</p>
      </hgroup>

      {plants.length > 0 && <WateringReminders plants={reminders} />}

      {plants.length === 0 ? (
        <section
          className="rounded-2xl border border-dashed border-border p-10 text-center"
          aria-label="Sem plantas cadastradas"
        >
          <p className="text-5xl" role="img" aria-label="Vaso de planta">🪴</p>
          <p className="mt-3 text-muted">
            Você ainda não cadastrou nenhuma planta.
          </p>
          <Link
            href="/plants/new"
            className="mt-4 inline-block rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            Cadastrar primeira planta
          </Link>
        </section>
      ) : (
        <section aria-label="Lista de plantas">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {plants.map((plant) => (
              <li key={plant.id}>
                <PlantCard plant={plant} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </section>
  );
}
