import prisma from "@/lib/prisma";
import { CreateReportSchemaInput } from "@/lib/report/validation";
import { getFullDayHours, getStartCash } from "./store";
import { cache } from "react";
import { DayRange } from "@/types";

// Upsert a report
export async function upsertReport(
  data: CreateReportSchemaInput,
  userId: string,
  isoString: string,
) {
  const { cardTips, cashTips, extraTips } = data;
  const { employees, ...reportData } = data;

  const date = new Date(isoString);
  const totalTips = cardTips + cashTips + extraTips;
  const totalPeople = employees.reduce(
    (acc, emp) => acc + (emp.fullDay ? 1 : 0.5),
    0,
  );
  const tipsPerPerson = totalTips / (totalPeople >= 1 ? totalPeople : 1);

  const fullDayHours = await getFullDayHours(
    date.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase(),
  );
  const startCash = await getStartCash();

  const report = await prisma.saleReport.upsert({
    where: { date },
    create: {
      date,
      fullDayHours,
      startCash,
      ...reportData,
      userId,
      employeeShifts: {
        create: employees.map((emp) => ({
          date,
          userId: emp.userId,
          tips:
            totalPeople > 1
              ? emp.fullDay
                ? tipsPerPerson
                : tipsPerPerson / 2
              : totalTips,
          hours: emp.fullDay ? fullDayHours : fullDayHours / 2,
        })),
      },
    },
    update: {
      fullDayHours,
      startCash,
      ...reportData,
      userId,
      employeeShifts: {
        deleteMany: { date },
        create: employees.map((emp) => ({
          date,
          userId: emp.userId,
          tips:
            totalPeople > 1
              ? emp.fullDay
                ? tipsPerPerson
                : tipsPerPerson / 2
              : totalTips,
          hours: emp.fullDay ? fullDayHours : fullDayHours / 2,
        })),
      },
    },
  });

  return report;
}

// Get report by date
export const getReportByDate = cache(async (date: Date) => {
  const report = await prisma.saleReport.findUnique({
    where: { date },
    include: {
      employeeShifts: {
        select: {
          userId: true,
          hours: true,
          user: { select: { name: true, image: true } },
        },
      },
      reporter: { select: { name: true, image: true } },
    },
  });

  return report;
});

// Get first report date
export const getFirstReportDate = cache(async () => {
  const report = await prisma.saleReport.findFirst({
    orderBy: { date: "asc" },
  });

  return report?.date;
});

// Get reports by date range
export async function getReportsByDateRange(dateRange: DayRange) {
  const reports = await prisma.saleReport.findMany({
    where: {
      date: { gte: dateRange.start, lte: dateRange.end },
    },
    select: {
      id: true,
      date: true,
      totalSales: true,
      cardSales: true,
      uberEatsSales: true,
      doorDashSales: true,
      skipTheDishesSales: true,
      onlineSales: true,
      expenses: true,
    },
    orderBy: { date: "asc" },
  });

  return reports;
}
