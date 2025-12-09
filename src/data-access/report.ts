import prisma from "@/lib/prisma";
import { toCents } from "@/lib/utils";
import { SaleReportInputs } from "@/lib/validations/report";
import { DayRange, SaleEmployee, SaleReportCardRawData } from "@/types";
import { Prisma } from "@prisma/client";
import { cache } from "react";
import "server-only";
import { getEmployeesByIds } from "./employee";
import { getStartCash } from "./store";

// Upsert a report
export async function upsertReport(data: SaleReportInputs, userId: string) {
  const { cardTips, cashTips, extraTips, employees, date, ...raw } = data;

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

// Get report raw data by unique input
export const getReportRaw = cache(
  async (
    where: Prisma.SaleReportWhereUniqueInput,
  ): Promise<SaleReportCardRawData | null> => {
    const report = await prisma.saleReport.findUnique({
      where,
      include: {
        reporter: { select: { name: true, image: true } },
      },
    });

    if (!report) return null;

    // Collect userIds from shifts
    const userIds = report.shifts.map((shift) => shift.userId);

    // Get user info for those userIds
    const users = await getEmployeesByIds(userIds);

    // Map userId to user info
    const userMap = new Map(
      users.map((user) => [
        user.id,
        { name: user.name, image: user.image || "" },
      ]),
    );

    // Map shifts to SaleEmployee objects with user info
    const employees: SaleEmployee[] = report.shifts.map((shift) => {
      const user = userMap.get(shift.userId);
      return {
        userId: shift.userId,
        hour: shift.hours,
        name: user?.name,
        image: user?.image,
      };
    });

    return {
      reporterName: report.reporter.name,
      reporterImage: report.reporter.image,
      employees,
      ...report,
    };
  },
);

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
