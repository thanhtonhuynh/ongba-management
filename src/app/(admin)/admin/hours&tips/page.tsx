import { getCurrentSession } from "@/lib/auth/session";
import { hasAccess } from "@/utils/access-control";
import { notFound, redirect } from "next/navigation";
import { HoursTipsTable } from "./_components/HoursTipsTable";
import {
  getIndividualHoursTipsInDayRange,
  getTotalHoursTipsInDayRange,
} from "@/data/employee";
import {
  getHoursTipsBreakdownInDayRange,
  getTodayBiweeklyPeriod,
} from "@/utils/hours-tips";
import moment from "moment";
import { DataTable } from "./_components/DataTable";

export default async function Page() {
  const { session, user } = await getCurrentSession();
  if (!session) redirect("/login");
  if (user.accountStatus !== "active") return notFound();
  if (!hasAccess(user.role, "/admin/hours&tips")) return notFound();

  const biweeklyPeriod = getTodayBiweeklyPeriod();
  const totalHoursTips = await getTotalHoursTipsInDayRange(biweeklyPeriod);
  const individualHoursTips =
    await getIndividualHoursTipsInDayRange(biweeklyPeriod);

  const { hoursBreakdown, tipsBreakdown } = getHoursTipsBreakdownInDayRange(
    biweeklyPeriod,
    totalHoursTips,
    individualHoursTips,
  );

  return (
    <div className="flex-1 space-y-4">
      <h2 className="gap-2 font-semibold sm:flex sm:items-baseline">
        <p>Current biweekly period:</p>
        <p className="text-sm font-medium">
          {moment(biweeklyPeriod.start).format("MMM D, YYYY")} -{" "}
          {moment(biweeklyPeriod.end).format("MMM D, YYYY")}
        </p>
      </h2>

      <div className="w-fit rounded-md border p-2 shadow-md">
        <h3 className="text-sm font-medium">Total hours and tips</h3>

        <HoursTipsTable data={totalHoursTips} />
      </div>

      <div className="hidden rounded-md border p-2 shadow-md lg:block">
        <h3 className="text-sm font-medium">Hours breakdown</h3>
        <DataTable
          startDay={biweeklyPeriod.start.getDate()}
          endDay={biweeklyPeriod.end.getDate()}
          data={hoursBreakdown}
        />
      </div>

      <div className="hidden rounded-md border p-2 shadow-md lg:block">
        <h3 className="text-sm font-medium">Tips breakdown</h3>
        <DataTable
          startDay={biweeklyPeriod.start.getDate()}
          endDay={biweeklyPeriod.end.getDate()}
          data={tipsBreakdown}
        />
      </div>
    </div>
  );
}
