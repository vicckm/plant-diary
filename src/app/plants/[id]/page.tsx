import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getWateringInfo, wateringStatusLabel } from "@/lib/watering";
import { formatDate } from "@/lib/format";
import { AddLogForm } from "@/components/AddLogForm";
import { LogTimeline } from "@/components/LogTimeline";
import { PlantImage } from "@/components/PlantImage";
import { StatusBadge } from "@/components/StatusBadge";
import { WaterButton } from "@/components/WaterButton";
import { DeletePlantButton } from "@/components/DeletePlantButton";

export default async function PlantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const plant = await prisma.plant.findUnique({
    where: { id },
    include: { logs: { orderBy: { createdAt: "desc" } } },
  });

  if (!plant) notFound();

  const info = getWateringInfo(plant, plant.logs);

  return (
    <article aria-labelledby="plant-name" className="space-y-6">
      <nav aria-label="Navegacao">
        <Link href="/" className="text-sm text-muted hover:underline">
          ← Voltar
        </Link>
      </nav>

      <header className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="h-32 w-32 shrink-0 overflow-hidden rounded-2xl border border-border bg-border/40">
          <PlantImage
            src={plant.coverPhotoUrl}
            alt={plant.name}
            fallbackLabel="Planta sem foto"
            width={128}
            height={128}
          />
        </div>
        <div className="flex-1">
          <h1 id="plant-name" className="text-2xl font-bold">{plant.name}</h1>
          {(plant.species || plant.nickname || plant.location) && (
            <p className="text-muted">
              {[plant.nickname, plant.species, plant.location]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <StatusBadge info={info} />
            <span className="text-sm text-muted">
              Rega a cada {plant.wateringIntervalDays} dia(s)
            </span>
          </div>
          <p className="mt-1 text-sm text-muted">
            Próxima rega: {formatDate(info.nextWateringAt)} ({wateringStatusLabel(info)})
          </p>
          <div role="group" aria-label="Acoes da planta" className="mt-4 flex items-center gap-2">
            <WaterButton plantId={plant.id} />
            <DeletePlantButton plantId={plant.id} />
          </div>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <AddLogForm plantId={plant.id} />

        <section aria-labelledby="history-heading">
          <h2 id="history-heading" className="mb-3 font-semibold">Histórico ({plant.logs.length})</h2>
          <LogTimeline logs={plant.logs} />
        </section>
      </section>
    </article>
  );
}
