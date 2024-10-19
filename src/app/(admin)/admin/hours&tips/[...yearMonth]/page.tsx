import { FULL_MONTHS } from "@/app/constants";
import { getCurrentSession } from "@/lib/auth/session";
import { hasAccess } from "@/utils/access-control";
import { getPeriodsByMonthAndYear } from "@/utils/hours-tips";
import { notFound, redirect } from "next/navigation";
import moment from "moment";
import { HoursTipsTable } from "../_components/HoursTipsTable";
import { getTotalHoursTipsInDayRange } from "@/data/employee";

type Props = {
  params: {
    yearMonth: string[];
  };
};

export default async function Page({ params }: Props) {
  const { session, user } = await getCurrentSession();
  if (!session) redirect("/login");
  if (user.accountStatus !== "active") return notFound();
  if (!hasAccess(user.role, "/admin/hours&tips")) return notFound();
  if (params.yearMonth.length !== 2) {
    return (
      <p className="text-destructive">
        404 - Please check the URL and try again.
      </p>
    );
  }

  const year = parseInt(params.yearMonth[0]);
  const month = parseInt(params.yearMonth[1]);
  if (isNaN(year) || isNaN(month)) {
    return (
      <p className="text-destructive">
        404 - Please check the URL and try again.dd
      </p>
    );
  }

  const periods = getPeriodsByMonthAndYear(year, month);
  const results = await Promise.all([
    getTotalHoursTipsInDayRange(periods[0]),
    getTotalHoursTipsInDayRange(periods[1]),
  ]);

  return (
    <div className="flex-1 space-y-4">
      <h2 className="font-semibold">
        {FULL_MONTHS[month - 1]} {year}
      </h2>

      <div className="flex justify-between space-x-4">
        {periods.map((period, index) => (
          <div key={index} className="w-full">
            <h3 className="text-sm font-medium">
              {moment(period.start).format("MMM D")} -{" "}
              {moment(period.end).format("MMM D")}
            </h3>

            <HoursTipsTable data={results[index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
