import { FULL_MONTHS, NUM_MONTHS } from "@/app/constants";
import { getCurrentSession } from "@/lib/auth/session";
import { hasAccess } from "@/utils/access-control";
import { getPeriodsByMonthAndYear } from "@/utils/hours-tips";
import { notFound, redirect } from "next/navigation";
import moment from "moment-timezone";
import { HoursTipsTable } from "../_components/HoursTipsTable";
import { getTotalHoursTipsInDayRange } from "@/data/employee";
import { ErrorMessage } from "@/components/Message";
import { getFirstReportDate } from "@/data/report";
import { GoBackButton } from "@/components/GoBackButton";

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
      <ErrorMessage
        className="self-start"
        message="Invalid year or month. Please check the URL and try again."
      />
    );
  }

  const year = parseInt(params.yearMonth[0]);
  const month = parseInt(params.yearMonth[1]);

  const today = moment().tz("America/Vancouver").startOf("day").toDate();
  const currentYear = today.getFullYear();
  const firstReportDate = await getFirstReportDate();
  const firstYear = firstReportDate?.getFullYear() || currentYear;

  if (
    isNaN(year) ||
    isNaN(month) ||
    !NUM_MONTHS.includes(month) ||
    year < firstYear ||
    year > currentYear
  ) {
    return (
      <ErrorMessage
        className="self-start"
        message="Invalid year or month. Please check the URL and try again."
      />
    );
  }

  const periods = getPeriodsByMonthAndYear(year, month);
  const results = await Promise.all([
    getTotalHoursTipsInDayRange(periods[0]),
    getTotalHoursTipsInDayRange(periods[1]),
  ]);

  return (
    <div className="flex-1 space-y-4">
      <GoBackButton
        url={`/admin/hours&tips`}
        variant={`outline`}
        className="gap-1"
      >
        Current biweekly period
      </GoBackButton>

      <h2 className="font-semibold">
        {FULL_MONTHS[month - 1]} {year}
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        {periods.map((period, index) => (
          <div key={index} className="w-full rounded-md border p-2 shadow-md">
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
