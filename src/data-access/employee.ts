import prisma from "@/lib/prisma";
import { DayRange, Shift } from "@/types";
import { cache } from "react";
import "server-only";

// Get current user employee shifts in date range
export const getUserShiftsInDateRange = cache(
  async (userId: string, dateRange: DayRange) => {
    const reports = await prisma.saleReport.findMany({
      where: {
        date: { gte: dateRange.start, lte: dateRange.end },
        shifts: { some: { userId } },
      },
      select: {
        date: true,
        shifts: true,
      },
    });

    return reports.flatMap((report) =>
      report.shifts
        .filter((shift) => shift.userId === userId)
        .map((shift) => ({
          date: report.date,
          hours: shift.hours,
          tips: shift.tips,
        })),
    );
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

// Fetch all shifts in a date range
export const getShiftsInDateRange = cache(async (dateRange: DayRange) => {
  // 1. Get sale reports that fall in the range, including embedded shifts
  const reports = await prisma.saleReport.findMany({
    where: {
      date: { gte: dateRange.start, lte: dateRange.end },
    },
    select: {
      date: true,
      shifts: true,
    },
  });

  // 2. Flatten all shifts and attach the report date
  const rawShifts = reports.flatMap((report) =>
    report.shifts.map((shift) => ({
      userId: shift.userId,
      date: report.date,
      hours: shift.hours,
      tips: shift.tips,
    })),
  );

  // 3. Load user info for all userIds found in shifts
  const userIds = [...new Set(rawShifts.map((shift) => shift.userId))];
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

  // 4. Build the Shift objects with user info
  const shifts: Shift[] = rawShifts.map((shift) => {
    const user = userMap.get(shift.userId);
    return {
      userId: shift.userId,
      userName: user?.name ?? "Unknown",
      userImage: user?.image ?? "",
      date: shift.date,
      hours: shift.hours,
      tips: shift.tips,
    };
  });

  return shifts;
});

// Get employess' info by IDs
export const getEmployeesByIds = cache(async (userIds: string[]) => {
  return prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, image: true },
  });
});
