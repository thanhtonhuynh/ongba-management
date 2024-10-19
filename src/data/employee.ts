import prisma from "@/lib/prisma";
import { DayRange } from "@/types";
import { cache } from "react";

// Get user month-to-date tips
export async function getUserMonthToDateTips(userId: string) {
  const today = new Date();

  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const tips = await prisma.individualTip.findMany({
    where: {
      userId,
      date: { gte: firstDayOfMonth, lte: today },
    },
  });

  return tips.reduce((acc, tip) => acc + tip.amount, 0);
}

// Get user month-to-date hours
export async function getUserMonthToDateHours(userId: string) {
  const today = new Date();

  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const workDays = await prisma.individualTip.findMany({
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
  // Start date of the day range
  const startDate = new Date(dayRange.start);
  // Add one day to the end date to include the entire day
  const endDate = new Date(dayRange.end);
  endDate.setDate(endDate.getDate() + 1);

  const hoursTipsData = await prisma.individualTip.groupBy({
    by: ["userId"],
    _sum: {
      hours: true,
      amount: true,
    },
    where: {
      date: { gte: startDate, lt: endDate },
    },
  });

  const employees = await getEmployees();

  const result = hoursTipsData.map((data) => {
    const employee = employees.find((emp) => emp.id === data.userId);

    return {
      userId: data.userId,
      name: employee?.name || "Unknown",
      totalHours: data._sum.hours || 0,
      totalTips: data._sum.amount || 0,
    };
  });

  return result.sort((a, b) => a.name.localeCompare(b.name));
}

// Get hours and tips breakdown for a specific day range
export async function getIndividualHoursTipsInDayRange(dayRange: DayRange) {
  // Start date of the day range
  const startDate = new Date(dayRange.start);
  // Add one day to the end date to include the entire day
  const endDate = new Date(dayRange.end);
  endDate.setDate(endDate.getDate() + 1);

  return await prisma.individualTip.findMany({
    where: {
      date: { gte: startDate, lt: endDate },
    },
    select: {
      userId: true,
      date: true,
      hours: true,
      amount: true,
    },
  });
}
