import { FULL_MONTHS, NUM_MONTHS } from "@/app/constants";
import { getCurrentSession } from "@/lib/auth/session";
import { hasAccess } from "@/utils/access-control";
import {
  getHoursTipsBreakdownInDayRange,
  getPeriodsByMonthAndYear,
} from "@/utils/hours-tips";
import { notFound, redirect } from "next/navigation";
import moment from "moment-timezone";
import { HoursTipsTable } from "../_components/HoursTipsTable";
import { getAllEmployeeShiftsInDayRange } from "@/data-access/employee";
import { ErrorMessage } from "@/components/Message";
import { getFirstReportDate } from "@/data-access/report";
import { GoBackButton } from "@/components/buttons/GoBackButton";
import { DataTable } from "../_components/DataTable";
import { Separator } from "@/components/ui/separator";
import { TotalHoursTips } from "@/types";
import { authenticatedRateLimit } from "@/utils/rate-limiter";
import { CalendarDays, MoveRight } from "lucide-react";
import { CurrentTag } from "@/components/CurrentTag";

type Params = Promise<{ yearMonth: string[] }>;

export default async function Page(props: { params: Params }) {
  const { session, user } = await getCurrentSession();
  if (!session) redirect("/login");
  if (user.accountStatus !== "active") return notFound();
  if (!hasAccess(user.role, "/admin")) return notFound();

  if (!(await authenticatedRateLimit(user.id))) {
    return (
      <ErrorMessage message="Too many requests. Please try again later." />
    );
  }

  const params = await props.params;
  if (params.yearMonth.length !== 2) {
    return (
      <ErrorMessage message="Invalid year or month. Please check the URL and try again." />
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
      <ErrorMessage message="Invalid year or month. Please check the URL and try again." />
    );
  }

  const periods = getPeriodsByMonthAndYear(year, month);
  console.log("periods", periods);

  const [firstPeriodEmployeeShifts, secondPeriodEmployeeShifts] =
    await Promise.all([
      getAllEmployeeShiftsInDayRange(periods[0]),
      getAllEmployeeShiftsInDayRange(periods[1]),
    ]);

  const hoursTipsBreakdowns = [
    getHoursTipsBreakdownInDayRange(periods[0], firstPeriodEmployeeShifts),
    getHoursTipsBreakdownInDayRange(periods[1], secondPeriodEmployeeShifts),
  ];

  const totalHoursTips: TotalHoursTips[] = [];
  for (const hoursTipsBreakdown of hoursTipsBreakdowns) {
    for (const hourRecord of hoursTipsBreakdown.hoursBreakdown) {
      const tipRecord = hoursTipsBreakdown.tipsBreakdown.find(
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
  }

  return (
    <div className="space-y-4">
      <GoBackButton
        url={`/admin/hours&tips`}
        variant={`outline`}
        className="gap-1"
        size={"sm"}
      >
        Back to current biweekly period
      </GoBackButton>

      <h2 className="flex items-center gap-2">
        {FULL_MONTHS[month - 1]} {year}
        {year === today.getFullYear() && month === today.getMonth() + 1 && (
          <CurrentTag />
        )}
      </h2>

      <div className="w-fit rounded-md border px-2 py-4 shadow-md">
        <h3 className="px-2 font-semibold">Total hours and tips</h3>

        <HoursTipsTable data={totalHoursTips} />
      </div>

      <div className="space-y-4 rounded-md border px-2 py-4 shadow-md">
        <h3 className="px-2 font-semibold">Hours breakdown</h3>

        {periods.map((period, index) => (
          <div key={index} className="space-y-2">
            <h4 className="flex w-fit items-center space-x-2 rounded border-l-2 border-l-blue-500 bg-muted px-2 py-1 text-sm font-medium">
              <CalendarDays size={15} className="text-blue-500" />
              <span>{moment(period.start).format("MMM D")}</span>
              <MoveRight size={15} />
              <span>{moment(period.end).format("MMM D")}</span>
            </h4>

            {hoursTipsBreakdowns[index].hoursBreakdown.length > 0 ? (
              <>
                <DataTable
                  dateRange={period}
                  data={hoursTipsBreakdowns[index].hoursBreakdown}
                />

                <Separator />
              </>
            ) : (
              <div className="p-2 text-sm text-muted-foreground">
                No record found for this period
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-4 rounded-md border px-2 py-4 shadow-md">
        <h3 className="px-2 font-semibold">Tips breakdown</h3>

        {periods.map((period, index) => (
          <div key={index} className="space-y-2">
            <h4 className="flex w-fit items-center space-x-2 rounded border-l-2 border-l-blue-500 bg-muted px-2 py-1 text-sm font-medium">
              <CalendarDays size={15} className="text-blue-500" />
              <span>{moment(period.start).format("MMM D")}</span>
              <MoveRight size={15} />
              <span>{moment(period.end).format("MMM D")}</span>
            </h4>

            {hoursTipsBreakdowns[index].tipsBreakdown.length > 0 ? (
              <>
                <DataTable
                  dateRange={period}
                  data={hoursTipsBreakdowns[index].tipsBreakdown}
                />

                <Separator />
              </>
            ) : (
              <div className="p-2 text-sm text-muted-foreground">
                No record found for this period
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
