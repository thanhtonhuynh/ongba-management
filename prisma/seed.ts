import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.storeSettings.upsert({
    where: { uniqueKey: "store" },
    update: {
      mondayShift: 11,
      tuesdayShift: 11,
      wednesdayShift: 11,
      thursdayShift: 11,
      fridayShift: 12,
      saturdayShift: 12,
      sundayShift: 11,
      startCash: 300,
    },
    create: {
      mondayShift: 11,
      tuesdayShift: 11,
      wednesdayShift: 11,
      thursdayShift: 11,
      fridayShift: 12,
      saturdayShift: 12,
      sundayShift: 11,
      startCash: 300,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
