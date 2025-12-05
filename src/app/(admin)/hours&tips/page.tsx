import { CurrentTag } from "@/components/CurrentTag";
import { ErrorMessage } from "@/components/Message";
import { getShiftsInDateRange } from "@/data-access/employee";
import { getCurrentSession } from "@/lib/auth/session";
import { TotalHoursTips } from "@/types";
import { hasAccess } from "@/utils/access-control";
import {
  getHoursTipsBreakdownInDayRange,
  getTodayBiweeklyPeriod,
} from "@/utils/hours-tips";
import { authenticatedRateLimit } from "@/utils/rate-limiter";
import { MoveRight } from "lucide-react";
import moment from "moment";
import { notFound, redirect } from "next/navigation";
import { DataTable } from "./_components/DataTable";
import { HoursTipsTable } from "./_components/HoursTipsTable";

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
  const employeeShifts = await getShiftsInDateRange(todayBiweeklyPeriod);

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
    <div className="space-y-8">
      <h2 className="flex items-center gap-2">
        <span>{moment(todayBiweeklyPeriod.start).format("MMM D, YYYY")}</span>
        <MoveRight size={17} />
        <span>{moment(todayBiweeklyPeriod.end).format("MMM D, YYYY")}</span>
        <CurrentTag />
      </h2>

      <div className="w-fit rounded-lg border p-6 shadow-sm">
        <h3 className="border-l-2 border-l-blue-500 px-2 font-semibold">
          Total hours and tips
        </h3>

        <HoursTipsTable data={totalHoursTips} />
      </div>

      <div className="space-y-2 rounded-lg border p-6 shadow-sm">
        <h3 className="border-l-2 border-l-blue-500 px-2 font-semibold">
          Hours breakdown
        </h3>
        <DataTable dateRange={todayBiweeklyPeriod} data={hoursBreakdown} />
      </div>

      <div className="space-y-2 rounded-lg border p-6 shadow-sm">
        <h3 className="border-l-2 border-l-blue-500 px-2 font-semibold">
          Tips breakdown
        </h3>
        <DataTable
          dateRange={todayBiweeklyPeriod}
          data={tipsBreakdown}
          isMoney
        />
      </div>
    </div>
  );
}
