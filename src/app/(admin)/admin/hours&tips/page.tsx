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

export default async function Page() {
  const { session, user } = await getCurrentSession();
  if (!session) redirect("/login");
  if (user.accountStatus !== "active") return notFound();
  if (!hasAccess(user.role, "/admin/hours&tips")) return notFound();

  const todayBiweeklyPeriod = getTodayBiweeklyPeriod();
  console.log(todayBiweeklyPeriod);
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
      <h2 className="gap-2 font-semibold sm:flex sm:items-baseline">
        <p>Current biweekly period:</p>
        <p className="text-sm font-medium">
          {moment(todayBiweeklyPeriod.start).format("MMM D, YYYY HH:mm:ss")} -{" "}
          {moment(todayBiweeklyPeriod.end).format("MMM D, YYYY HH:mm:ss")}
        </p>
      </h2>

      <div className="w-fit rounded-md border p-2 shadow-md">
        <h3 className="text-sm font-medium">Total hours and tips</h3>

        <HoursTipsTable data={totalHoursTips} />
      </div>

      <div className="space-y-2 rounded-md border p-2 shadow-md">
        <h3 className="text-sm font-medium">Hours breakdown</h3>
        <DataTable dateRange={todayBiweeklyPeriod} data={hoursBreakdown} />
      </div>

      <div className="space-y-2 rounded-md border p-2 shadow-md">
        <h3 className="text-sm font-medium">Tips breakdown</h3>
        <DataTable dateRange={todayBiweeklyPeriod} data={tipsBreakdown} />
      </div>
    </div>
  );
}
