import prisma from "@/lib/prisma";
import { CreateReportSchemaTypes } from "@/lib/report/validation";
import { getFullDayHours, getStartCash } from "./store";

// Create a new report
export async function createReport(
  data: CreateReportSchemaTypes,
  userId: string,
  utcDay: string,
) {
  const { cardTips, cashTips, extraTips } = data;
  const { employees, ...reportData } = data;
  console.log(utcDay);
  const date = new Date(utcDay);
  console.log(date);
  date.setUTCHours(0, 0, 0, 0);
  console.log(date);
  const totalTips = cardTips + cashTips + extraTips;
  const totalPeople =
    employees.reduce((acc, emp) => acc + (emp.fullDay ? 1 : 0.5), 0) || 1;
  const tipsPerPerson = totalTips / totalPeople;

  const fullDayHours = await getFullDayHours(
    date.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase(),
  );
  const startCash = await getStartCash();

  const report = await prisma.saleReport.create({
    data: {
      date,
      fullDayHours,
      startCash,
      ...reportData,
      userId,
      individualTips: {
        create: employees.map((emp) => ({
          userId: emp.userId,
          amount: emp.fullDay ? tipsPerPerson : tipsPerPerson / 2,
          hours: emp.fullDay ? fullDayHours : fullDayHours / 2,
          date,
        })),
      },
    },
  });

  return report;
}

// Determine if a report has already been created today
export async function todayReportIsCreated() {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

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

// Get today's report
export async function getTodayReport() {
  const today = new Date();
  console.log(today);
  today.setHours(0, 0, 0, 0);
  console.log(today);
  today.setUTCHours(0, 0, 0, 0);
  console.log(today);

  const report = await prisma.saleReport.findFirst({
    where: {
      date: { gte: today },
    },
    include: {
      individualTips: {
        select: { userId: true, hours: true, user: { select: { name: true } } },
      },
      reporter: { select: { name: true } },
    },
  });

  return report;
}

// Get first report date
export async function getFirstReportDate() {
  const report = await prisma.saleReport.findFirst({
    orderBy: { date: "asc" },
  });

  return report?.date;
}

// Get all reports
export async function getAllReports() {
  const reports = await prisma.saleReport.findMany({
    orderBy: { date: "desc" },
    include: {
      individualTips: {
        select: { userId: true, hours: true, user: { select: { name: true } } },
      },
      reporter: { select: { name: true } },
    },
  });

  return reports;
}

// Get report by date
export async function getReportByDate(date: Date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const report = await prisma.saleReport.findFirst({
    where: { date: { gte: startOfDay, lte: endOfDay } },
    include: {
      individualTips: {
        select: { userId: true, hours: true, user: { select: { name: true } } },
      },
      reporter: { select: { name: true } },
    },
  });

  return report;
}
