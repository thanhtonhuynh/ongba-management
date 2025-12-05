import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function toCents(value) {
  if (value == null) return 0;
  // half-up rounding
  return Math.floor(value * 100 + 0.5);
}

async function main() {
  // console.log("Fetching all SaleReport docs…");
  // const reports = await prisma.saleReport.findMany();
  // console.log(`Found ${reports.length} SaleReport records`);
  // for (const report of reports) {
  //   await prisma.saleReport.update({
  //     where: { id: report.id },
  //     data: {
  //       totalSales: toCents(report.totalSales),
  //       cardSales: toCents(report.cardSales),
  //       uberEatsSales: toCents(report.uberEatsSales),
  //       skipTheDishesSales: toCents(report.skipTheDishesSales),
  //       doorDashSales: toCents(report.doorDashSales),
  //       onlineSales: toCents(report.onlineSales),
  //       expenses: toCents(report.expenses),
  //       cardTips: toCents(report.cardTips),
  //       cashTips: toCents(report.cashTips),
  //       extraTips: toCents(report.extraTips),
  //       cashInTill: toCents(report.cashInTill),
  //       startCash: toCents(report.startCash),
  //     },
  //   });
  //   console.log(`Updated SaleReport ${report.id}`);
  // }
  // console.log("✔ Migration finished. All Float → Int (cents) for SaleReport.");
  // console.log("Fetching all EmployeeShift docs…");
  // const shifts = await prisma.employeeShift.findMany();
  // console.log(`Found ${shifts.length} EmployeeShift records`);
  // console.log("Migrating tips field to Int (cents)...");
  // for (const shift of shifts) {
  //   await prisma.employeeShift.update({
  //     where: { id: shift.id },
  //     data: {
  //       tips: toCents(shift.tips),
  //     },
  //   });
  //   // console.log(`Updated EmployeeShift ${shift.id}`);
  // }
  // console.log(
  //   "✔ Migration finished. All Float → Int (cents) for EmployeeShift.",
  // );
  // console.log("Fetching all ExpenseEntry docs…");
  // const expenses = await prisma.expense.findMany();
  // console.log(`Found ${expenses.length} ExpenseEntry records`);
  // for (const expense of expenses) {
  //   // update entries array
  //   const updatedEntries = expense.entries.map((entry) => ({
  //     ...entry,
  //     amount: toCents(entry.amount),
  //   }));
  //   await prisma.expense.update({
  //     where: { id: expense.id },
  //     data: { entries: updatedEntries },
  //   });
  //   console.log(`Updated ExpenseEntry ${expense.id}`);
  // }
  // console.log(
  //   "✔ Migration finished. All Float → Int (cents) for ExpenseEntry.",
  // );
  // console.log("Fetching StoreSettings doc…");
  // const storeSettings = await prisma.storeSettings.findUnique({
  //   where: { uniqueKey: "store" },
  // });
  // if (storeSettings) {
  //   await prisma.storeSettings.update({
  //     where: { id: storeSettings.id },
  //     data: {
  //       startCash: toCents(storeSettings.startCash),
  //     },
  //   });
  //   console.log(
  //     "✔ Migration finished. Float → Int (cents) for StoreSettings.",
  //   );
  // } else {
  //   console.log("No StoreSettings document found.");
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
