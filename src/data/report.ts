import prisma from "@/lib/prisma";
import { CreateReportSchemaTypes } from "@/lib/report/validation";

// Create a new report
export async function createReport(
  data: CreateReportSchemaTypes,
  userId: string,
) {
  const {
    saleTotal,
    uberEatsSales,
    doorDashSales,
    skipTheDishesSales,
    onlineSales,
    cardTotal,
    expenses,
    cardTips,
    cashTips,
    extraTips,
  } = data;

  const { employees, ...reportData } = data;

  const otherSales =
    uberEatsSales + doorDashSales + skipTheDishesSales + onlineSales;
  const inStoreSales = saleTotal - otherSales;
  const cashTotal = inStoreSales - cardTotal;
  const actualCash = cashTotal - expenses;

  const totalTips = cardTips + cashTips + extraTips;
  const totalPeople =
    employees.reduce((acc, emp) => acc + (emp.fullDay ? 1 : 0.5), 0) || 1;
  const tipsPerPerson = totalTips / totalPeople;

  const report = await prisma.saleReport.create({
    data: {
      date: new Date(),
      cashTotal,
      actualCash,
      ...reportData,
      userId,
      individualTips: {
        create: employees.map((emp) => ({
          userId: emp.userId,
          amount: emp.fullDay ? tipsPerPerson : tipsPerPerson / 2,
          date: new Date(),
        })),
      },
    },
  });

  return report;
}

// Determine if a report has already been created today
export async function todayReportIsCreated() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const report = await prisma.saleReport.findFirst({
    where: {
      date: { gte: today },
    },
  });

  return !!report;
}

// Delete today's report
export async function deleteTodayReport() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.saleReport.deleteMany({
    where: {
      date: { gte: today },
    },
  });
}
