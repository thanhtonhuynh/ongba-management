import prisma from "@/lib/prisma";
import { CreateReportSchemaInput } from "@/lib/report/validation";
import { getFullDayHours, getStartCash } from "./store";
import moment from "moment-timezone";

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

// Get today's report
export async function getTodayReport() {
  const today = moment().tz("America/Vancouver", true).startOf("day").toDate();
  console.log(today);

  const report = await prisma.saleReport.findFirst({
    where: {
      date: today,
    },
    include: {
      employeeShifts: {
        select: { userId: true, hours: true, user: { select: { name: true } } },
      },
      reporter: { select: { name: true } },
    },
  });

  return { todayReport: report, today };
}

// Create a new report
// *Currently not using this function*
// export async function createReport(
//   data: CreateReportSchemaInput,
//   userId: string,
//   isoString: string,
// ) {
//   const { cardTips, cashTips, extraTips } = data;
//   const { employees, ...reportData } = data;

//   const date = new Date(isoString);
//   const totalTips = cardTips + cashTips + extraTips;
//   const totalPeople = employees.reduce(
//     (acc, emp) => acc + (emp.fullDay ? 1 : 0.5),
//     0,
//   );
//   const tipsPerPerson = totalTips / (totalPeople >= 1 ? totalPeople : 1);

//   const fullDayHours = await getFullDayHours(
//     date.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase(),
//   );
//   const startCash = await getStartCash();

//   const report = await prisma.saleReport.create({
//     data: {
//       date,
//       fullDayHours,
//       startCash,
//       ...reportData,
//       userId,
//       employeeShifts: {
//         create: employees.map((emp) => ({
//           userId: emp.userId,
//           tips:
//             totalPeople > 1
//               ? emp.fullDay
//                 ? tipsPerPerson
//                 : tipsPerPerson / 2
//               : totalTips,
//           hours: emp.fullDay ? fullDayHours : fullDayHours / 2,
//           date,
//         })),
//       },
//     },
//   });

//   return report;
// }

// Determine if a report has already been created today
// *Currently not using this function*
// export async function todayReportIsCreated() {
//   // const today = new Date();
//   // today.setUTCHours(7, 0, 0, 0);

//   const today = moment().utcOffset("America/Vancouver").startOf("day").toDate();

//   const report = await prisma.saleReport.findFirst({
//     where: {
//       date: { gte: today },
//     },
//   });

//   return !!report;
// }

// Delete today's report
// *Currently not using this function*
// export async function deleteTodayReport() {
//   // const today = new Date();
//   // today.setUTCHours(7, 0, 0, 0);

//   const today = moment().utcOffset("America/Vancouver").startOf("day").toDate();

//   await prisma.saleReport.deleteMany({
//     where: {
//       date: { gte: today },
//     },
//   });
// }

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
      employeeShifts: {
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
      employeeShifts: {
        select: { userId: true, hours: true, user: { select: { name: true } } },
      },
      reporter: { select: { name: true } },
    },
  });

  return report;
}
