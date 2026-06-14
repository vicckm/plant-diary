import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function daysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

async function main() {
  await prisma.logEntry.deleteMany();
  await prisma.plant.deleteMany();

  // Atrasada: regada ha 12 dias, intervalo 7
  const monstera = await prisma.plant.create({
    data: {
      name: "Costela-de-adao",
      nickname: "Costelinha",
      species: "Monstera deliciosa",
      location: "Sala",
      wateringIntervalDays: 7,
      logs: {
        create: [
          { type: "WATERING", createdAt: daysAgo(12) },
          {
            type: "HEALTH",
            healthStatus: "ATTENTION",
            note: "Algumas folhas amareladas.",
            createdAt: daysAgo(5),
          },
        ],
      },
    },
  });

  // Regar hoje: regada ha 5 dias, intervalo 5
  const samambaia = await prisma.plant.create({
    data: {
      name: "Samambaia",
      species: "Nephrolepis exaltata",
      location: "Varanda",
      wateringIntervalDays: 5,
      logs: {
        create: [{ type: "WATERING", createdAt: daysAgo(5) }],
      },
    },
  });

  // Em dia: regada hoje, intervalo 10
  const suculenta = await prisma.plant.create({
    data: {
      name: "Suculenta",
      species: "Echeveria",
      location: "Escritorio",
      wateringIntervalDays: 10,
      logs: {
        create: [
          { type: "WATERING", createdAt: daysAgo(0) },
          { type: "HEALTH", healthStatus: "HEALTHY", note: "Bem cheia.", createdAt: daysAgo(0) },
        ],
      },
    },
  });

  console.log("Seed concluido:", {
    monstera: monstera.name,
    samambaia: samambaia.name,
    suculenta: suculenta.name,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
