import prisma from "@/lib/prisma";
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
