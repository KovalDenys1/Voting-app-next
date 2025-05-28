import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.party.createMany({
    data: [
      { name: "Arbeiderpartiet" },
      { name: "Høyre" },
      { name: "Fremskrittspartiet" },
      { name: "Senterpartiet" },
      { name: "SV – Sosialistisk Venstreparti" },
      { name: "Miljøpartiet De Grønne" },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(() => console.log("✅ Seed complete"))
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
