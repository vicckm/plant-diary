import Link from "next/link";
import type { LogEntry, Plant } from "@prisma/client";
import { getWateringInfo } from "@/lib/watering";
import { PlantImage } from "./PlantImage";
import { StatusBadge } from "./StatusBadge";
import { WaterButton } from "./WaterButton";

type PlantWithLogs = Plant & { logs: LogEntry[] };

export function PlantCard({ plant }: { plant: PlantWithLogs }) {
  const info = getWateringInfo(plant, plant.logs);
  const lastHealth = plant.logs.find((l) => l.healthStatus)?.healthStatus ?? null;

  return (
    <article className="plant-card flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-md">
      <Link href={`/plants/${plant.id}`} className="block">
        <div className="aspect-[4/3] w-full overflow-hidden bg-border/40">
          <PlantImage
            src={plant.coverPhotoUrl}
            alt={plant.name}
            width={400}
            height={300}
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <Link href={`/plants/${plant.id}`} className="hover:underline">
            <h3 className="font-semibold leading-tight">{plant.name}</h3>
          </Link>
          {(plant.species || plant.location) && (
            <p className="text-sm text-muted">
              {[plant.species, plant.location].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge info={info} />
          {lastHealth && (
            <span className="text-xs text-muted">
              Saude: {lastHealth.toLowerCase()}
            </span>
          )}
        </div>
        <div className="mt-auto pt-1">
          <WaterButton plantId={plant.id} />
        </div>
      </div>
    </article>
  );
}
