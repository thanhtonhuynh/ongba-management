import "server-only";
import prisma from "@/lib/prisma";
import { DayRange } from "@/types";
import { cache } from "react";

// Get current user employee shifts in date range
export const getUserShiftsInDateRange = cache(
  async (userId: string, dateRange: DayRange) => {
    return await prisma.employeeShift.findMany({
      where: {
        userId,
        date: { gte: dateRange.start, lte: dateRange.end },
      },
      select: { id: true, date: true, hours: true, tips: true },
      orderBy: { date: "asc" },
    });
  },
);

// Get employees with optional status filter
export const getEmployees = cache(async (status?: string) => {
  return prisma.user.findMany({
    where: {
      accountStatus: status,
    },
    orderBy: { name: "asc" },
  });
});

// Get hours and tips breakdown for a specific day range
export const getAllEmployeeShiftsInDayRange = cache(
  async (dateRange: DayRange) => {
    return await prisma.employeeShift.findMany({
      where: {
        date: { gte: dateRange.start, lte: dateRange.end },
      },
      select: {
        userId: true,
        date: true,
        hours: true,
        tips: true,
        user: { select: { name: true, image: true } },
      },
    });
  },
);

// Get employees total biweekly hours and tips
// export async function getTotalHoursTipsInDayRange(dayRange: DayRange) {
//   const hoursTipsData = await prisma.employeeShift.groupBy({
//     by: ["userId"],
//     _sum: {
//       hours: true,
//       tips: true,
//     },
//     where: {
//       date: { gte: dayRange.start, lte: dayRange.end },
//     },
//   });

//   const employees = await getEmployees();

//   const result = hoursTipsData.map((data) => {
//     const employee = employees.find((emp) => emp.id === data.userId);

//     return {
//       userId: data.userId,
//       name: employee?.name || "Unknown",
//       image: employee?.image || "",
//       totalHours: data._sum.hours || 0,
//       totalTips: data._sum.tips || 0,
//     };
//   });

//   return result.sort((a, b) => a.name.localeCompare(b.name));
// }
