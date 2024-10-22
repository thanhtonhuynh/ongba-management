import prisma from "@/lib/prisma";
import { DayRange } from "@/types";
import { cache } from "react";

// Get user month-to-date tips
export async function getUserMonthToDateTips(userId: string) {
  const today = new Date();

  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const tips = await prisma.employeeShift.findMany({
    where: {
      userId,
      date: { gte: firstDayOfMonth, lte: today },
    },
  });

  return tips.reduce((acc, tip) => acc + tip.tips, 0);
}

// Get user month-to-date hours
export async function getUserMonthToDateHours(userId: string) {
  const today = new Date();

  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const workDays = await prisma.employeeShift.findMany({
    where: {
      userId,
      date: { gte: firstDayOfMonth, lte: today },
    },
    select: { hours: true },
  });

  return workDays.reduce((acc, workDay) => acc + workDay.hours, 0);
}

// Get employees with optional status filter
export const getEmployees = cache(async (status?: string) => {
  return prisma.user.findMany({
    where: {
      accountStatus: status,
    },
    orderBy: { name: "asc" },
  });
});

// Update employee status
export async function updateEmployeeStatus(userId: string, status: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { accountStatus: status },
  });
}

// Update employee role
export async function updateEmployeeRole(userId: string, role: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { role },
  });
}

// Get employees total biweekly hours and tips
// Return userId, name, hours, and tips
export async function getTotalHoursTipsInDayRange(dayRange: DayRange) {
  const hoursTipsData = await prisma.employeeShift.groupBy({
    by: ["userId"],
    _sum: {
      hours: true,
      tips: true,
    },
    where: {
      date: { gte: dayRange.start, lte: dayRange.end },
    },
  });

  const employees = await getEmployees();

  const result = hoursTipsData.map((data) => {
    const employee = employees.find((emp) => emp.id === data.userId);

    return {
      userId: data.userId,
      name: employee?.name || "Unknown",
      totalHours: data._sum.hours || 0,
      totalTips: data._sum.tips || 0,
    };
  });

  return result.sort((a, b) => a.name.localeCompare(b.name));
}

// Get hours and tips breakdown for a specific day range
export async function getEmployeeShiftsInDayRange(dayRange: DayRange) {
  return await prisma.employeeShift.findMany({
    where: {
      date: { gte: dayRange.start, lte: dayRange.end },
    },
    select: {
      userId: true,
      date: true,
      hours: true,
      tips: true,
      user: { select: { name: true } },
    },
  });
}
