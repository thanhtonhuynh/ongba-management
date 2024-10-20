import prisma from "@/lib/prisma";
import { CreateReportSchemaTypes } from "@/lib/report/validation";
import { getFullDayHours, getStartCash } from "./store";
import moment, { utc } from "moment";

// Create a new report
export async function createReport(
  data: CreateReportSchemaTypes,
  userId: string,
  utcString: string,
) {
  const { cardTips, cashTips, extraTips } = data;
  const { employees, ...reportData } = data;

  const date = new Date("2024-10-20T06:00:00.000Z");
  // if (date.getUTCHours() < 7) {
  //   date.setDate(date.getDate() - 1);
  // }

  // date.setUTCHours(7, 0, 0, 0);

  // const date = utc().utcOffset(-7).startOf("day").toDate();
  console.log(date);
  // const date = new Date(utcString);
  // console.log("server Date from utc string", date);
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
  // const today = new Date();
  // today.setUTCHours(7, 0, 0, 0);

  const today = moment().utcOffset("America/Vancouver").startOf("day").toDate();

  const report = await prisma.saleReport.findFirst({
    where: {
      date: { gte: today },
    },
  });

  return !!report;
}

// Delete today's report
export async function deleteTodayReport() {
  // const today = new Date();
  // today.setUTCHours(7, 0, 0, 0);

  const today = moment().utcOffset("America/Vancouver").startOf("day").toDate();

  await prisma.saleReport.deleteMany({
    where: {
      date: { gte: today },
    },
  });
}

// Get today's report
export async function getTodayReport() {
  const today = moment("2024-10-20T06:20:00.000Z")
    .utcOffset("America/Vancouver")
    .startOf("day")
    .toDate();
  // console.log(today);

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
