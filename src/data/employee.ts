import prisma from "@/lib/prisma";

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
