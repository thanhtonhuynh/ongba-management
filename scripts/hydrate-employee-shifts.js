import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // const reports = await prisma.saleReport.findMany({
  //   select: {
  //     id: true,
  //     employeeShifts: true,
  //   },
  // });
  // for (const report of reports) {
  //   const shiftEntries = report.employeeShifts.map((shift) => ({
  //     userId: shift.userId,
  //     hours: shift.hours,
  //     tips: shift.tips,
  //   }));
  //   await prisma.saleReport.update({
  //     where: { id: report.id },
  //     data: {
  //       shifts: { set: shiftEntries },
  //     },
  //   });
  // }
}

main()
  .catch((e) => {
    console.error("Migration error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
