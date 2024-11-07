import { getCurrentSession } from "@/lib/auth/session";
import { hasAccess } from "@/utils/access-control";
import { notFound, redirect } from "next/navigation";
import { HoursTipsTable } from "./_components/HoursTipsTable";
import { getAllEmployeeShiftsInDayRange } from "@/data-access/employee";
import {
  getHoursTipsBreakdownInDayRange,
  getTodayBiweeklyPeriod,
} from "@/utils/hours-tips";
import moment from "moment";
import { DataTable } from "./_components/DataTable";
import { TotalHoursTips } from "@/types";
import { authenticatedRateLimit } from "@/utils/rate-limiter";
import { ErrorMessage } from "@/components/Message";
import { MoveRight } from "lucide-react";

export default async function Page() {
  const { session, user } = await getCurrentSession();
  if (!session) redirect("/login");
  if (user.accountStatus !== "active") return notFound();
  if (!hasAccess(user.role, "/admin")) return notFound();

  if (!(await authenticatedRateLimit(user.id))) {
    return (
      <ErrorMessage message="Too many requests. Please try again later." />
    );
  }

  const todayBiweeklyPeriod = getTodayBiweeklyPeriod();
  const employeeShifts =
    await getAllEmployeeShiftsInDayRange(todayBiweeklyPeriod);

  const { hoursBreakdown, tipsBreakdown } = getHoursTipsBreakdownInDayRange(
    todayBiweeklyPeriod,
    employeeShifts,
  );

  const totalHoursTips: TotalHoursTips[] = [];
  for (const hourRecord of hoursBreakdown) {
    const tipRecord = tipsBreakdown.find(
      (tipRecord) => tipRecord.userId === hourRecord.userId,
    );
    if (tipRecord) {
      totalHoursTips.push({
        userId: hourRecord.userId,
        name: hourRecord.userName,
        image: hourRecord.image,
        totalHours: hourRecord.total,
        totalTips: tipRecord.total,
      });
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="gap-2 space-y-2 text-xl font-semibold sm:flex sm:items-baseline sm:space-x-2 sm:space-y-0">
        <p className="">Current biweekly period</p>
        <p className="flex items-center justify-center space-x-2 text-base text-muted-foreground">
          <span>{moment(todayBiweeklyPeriod.start).format("MMM D, YYYY")}</span>
          <MoveRight size={15} />
          <span>{moment(todayBiweeklyPeriod.end).format("MMM D, YYYY")}</span>
        </p>
      </h2>

      <div className="w-fit rounded-md border px-2 py-4 shadow-md">
        <h3 className="border-l-2 border-l-blue-500 px-2 font-semibold">
          Total hours and tips
        </h3>

        <HoursTipsTable data={totalHoursTips} />
      </div>

      <div className="space-y-2 rounded-md border px-2 py-4 shadow-md">
        <h3 className="border-l-2 border-l-blue-500 px-2 font-semibold">
          Hours breakdown
        </h3>
        <DataTable dateRange={todayBiweeklyPeriod} data={hoursBreakdown} />
      </div>

      <div className="space-y-2 rounded-md border px-2 py-4 shadow-md">
        <h3 className="border-l-2 border-l-blue-500 px-2 font-semibold">
          Tips breakdown
        </h3>
        <DataTable dateRange={todayBiweeklyPeriod} data={tipsBreakdown} />
      </div>
    </div>
  );
}