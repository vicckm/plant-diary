import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function parseDateBR(dateStr) {
  const [day, month, year] = dateStr.split("/").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0);
}

const plants = [
  {
    name: "Jurema",
    nickname: "Jureminha",
    species: "Ficus Lyrata Bambino",
    location: "Escritório",
    wateringIntervalDays: 10,
    lastWatered: "03/06/2026",
    coverPhotoUrl: "/uploads/49a99cc1-c059-485b-ab2d-1d7a27e7003e.jpg",
    note: "Para regar novamente é necessário verificar se o substrato está seco por uns 3cm. Adicione um palito e verifique antes de regar.",
  },
  {
    name: "Costela",
    nickname: "Costelinha",
    species: "Monstera Costela de Adão",
    location: "Escritório 10",
    wateringIntervalDays: 7,
    lastWatered: "11/06/2026",
    note: "Para regar novamente é necessário verificar se o substrato está seco por até 5cm. Adicione um palito e verifique antes de regar.",
  },
  {
    name: "Borracha",
    nickname: "Borrachinha",
    species: "Planta da borracha",
    location: "Sala",
    wateringIntervalDays: 14,
    lastWatered: "10/06/2026",
    note: "Para regar novamente é necessário verificar se o substrato está seco por até 5cm. Adicione um palito e verifique antes de regar.",
  },
  {
    name: "Lola",
    nickname: "Lolinha",
    species: "Lírio da Paz",
    location: "Sala",
    wateringIntervalDays: 10,
    lastWatered: "09/06/2026",
    note: "Para regar novamente é necessário verificar se o substrato está seco por até 5cm. Adicione um palito e verifique antes de regar.",
  },
  {
    name: "Zeca",
    nickname: "Zequinha",
    species: "Zamioculca",
    location: "Sala",
    wateringIntervalDays: 21,
    lastWatered: "09/06/2026",
    note: "Para regar novamente é necessário verificar se o substrato está seco por até 7cm. Adicione um palito e verifique antes de regar.",
  },
  {
    name: "Eva",
    nickname: "Evinha",
    species: "Costela de Eva (Monstera adansonii)",
    location: "Cozinha",
    wateringIntervalDays: 10,
    lastWatered: "11/06/2026",
    note: "Para regar novamente é necessário verificar se o substrato está seco por até 4cm. Adicione um palito e verifique antes de regar.",
  },
  {
    name: "Pépe",
    nickname: "Pépinho",
    species: "Peperomia Caperata",
    location: "Banheiro",
    wateringIntervalDays: 10,
    lastWatered: "11/06/2026",
    note: "Para regar novamente é necessário verificar se o substrato está seco por até 3cm. Adicione um palito e verifique antes de regar.",
  },
  {
    name: "Híbrida",
    nickname: "Bradinha",
    species: "Croton Hibrido Petra",
    location: "Sala",
    wateringIntervalDays: 7,
    lastWatered: "10/06/2026",
    note: "Para regar novamente é necessário verificar se o substrato está seco por até 3cm. Adicione um palito e verifique antes de regar.",
  },
  {
    name: "Benedita",
    nickname: "Ditinha",
    species: "Espada-de-Santa-Bárbara",
    location: "Sala",
    wateringIntervalDays: 20,
    lastWatered: "14/06/2026",
    coverPhotoUrl: "/uploads/948bdd7c-89fe-411d-b47b-3766294b771d.jpg",
    note: "Para regar novamente é necessário verificar se o substrato está seco por até 7cm. Adicione um palito e verifique antes de regar.",
  },
];

async function main() {
  await prisma.logEntry.deleteMany();
  await prisma.plant.deleteMany();

  const created = [];

  for (const plant of plants) {
    const wateredAt = parseDateBR(plant.lastWatered);

    const record = await prisma.plant.create({
      data: {
        name: plant.name,
        nickname: plant.nickname,
        species: plant.species,
        location: plant.location,
        wateringIntervalDays: plant.wateringIntervalDays,
        coverPhotoUrl: plant.coverPhotoUrl ?? null,
        logs: {
          create: [
            { type: "WATERING", createdAt: wateredAt },
            { type: "NOTE", note: plant.note, createdAt: wateredAt },
          ],
        },
      },
    });

    created.push(record.name);
  }

  console.log("Seed concluido:", created);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
