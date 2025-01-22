import prisma from "@/lib/prisma";
import { CreateReportSchemaInput } from "@/lib/validations/report";
import { DayRange } from "@/types";
import { cache } from "react";
import "server-only";
import { getStartCash } from "./store";

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
  const totalHours = employees.reduce((acc, emp) => acc + emp.hour, 0);
  const tipsPerHour = totalTips / totalHours;

  const startCash = await getStartCash();

  const report = await prisma.saleReport.upsert({
    where: { date },
    create: {
      date,
      startCash,
      ...reportData,
      userId,
      employeeShifts: {
        create: employees.map((emp) => ({
          date,
          userId: emp.userId,
          tips: tipsPerHour * emp.hour,
          hours: emp.hour,
        })),
      },
    },
    update: {
      startCash,
      ...reportData,
      userId,
      employeeShifts: {
        deleteMany: { date },
        create: employees.map((emp) => ({
          date,
          userId: emp.userId,
          tips: tipsPerHour * emp.hour,
          hours: emp.hour,
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
          // tips: true,
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
export const getReportsByDateRange = cache(async (dateRange: DayRange) => {
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
});
