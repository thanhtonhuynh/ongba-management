import prisma from "@/lib/prisma";
import { toCents } from "@/lib/utils";
import { CreateReportSchemaInput } from "@/lib/validations/report";
import { DayRange, SaleEmployee, SaleReportCardRawData } from "@/types";
import { cache } from "react";
import "server-only";
import { getStartCash } from "./store";

// Upsert a report
export async function upsertReport(
  data: CreateReportSchemaInput,
  userId: string,
  isoString: string,
) {
  const { cardTips, cashTips, extraTips, employees, ...raw } = data;

  // Convert all money values to cents
  const reportDataInCents = {
    totalSales: toCents(raw.totalSales),
    cardSales: toCents(raw.cardSales),
    uberEatsSales: toCents(raw.uberEatsSales),
    doorDashSales: toCents(raw.doorDashSales),
    skipTheDishesSales: toCents(raw.skipTheDishesSales),
    onlineSales: toCents(raw.onlineSales),
    expenses: toCents(raw.expenses),
    cashInTill: toCents(raw.cashInTill),
    cardTips: toCents(cardTips),
    cashTips: toCents(cashTips),
    extraTips: toCents(extraTips),
  };

  const date = new Date(isoString);

  // Calculate tips per hour and distribute tips among employees
  const totalTips = cardTips + cashTips + extraTips;
  const totalHours = employees.reduce((acc, emp) => acc + emp.hour, 0);
  const tipsPerHour = totalTips / totalHours;

  const shifts = employees.map((emp) => ({
    userId: emp.userId,
    hours: emp.hour,
    tips: toCents(tipsPerHour * emp.hour),
  }));

  // Get starting cash
  const startCash = await getStartCash();

  const report = await prisma.saleReport.upsert({
    where: { date },
    create: {
      date,
      userId,
      startCash,
      expensesReason: raw.expensesReason,
      ...reportDataInCents,
      shifts,
    },
    update: {
      userId,
      startCash,
      expensesReason: raw.expensesReason,
      ...reportDataInCents,
      shifts: { set: shifts },
    },
  });

  return report;
}

// Get report by date
export const getReportByDate = cache(async (date: Date) => {
  const report = await prisma.saleReport.findUnique({
    where: { date },
    include: {
      reporter: { select: { name: true, image: true } },
    },
  });

  if (!report) return null;

  const userIds = [...new Set(report.shifts.map((shift) => shift.userId))];
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, image: true },
  });
  const userMap = new Map(
    users.map((user) => [
      user.id,
      { name: user.name, image: user.image || "" },
    ]),
  );

  const employees: SaleEmployee[] = report.shifts.map((shift) => {
    const user = userMap.get(shift.userId);
    return {
      userId: shift.userId,
      hour: shift.hours,
      name: user?.name ?? "Unknown",
      image: user?.image,
    };
  });

  const rawData: SaleReportCardRawData = {
    reporterName: report.reporter.name,
    reporterImage: report.reporter.image,
    employees,
    ...report,
  };

  return rawData;
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
