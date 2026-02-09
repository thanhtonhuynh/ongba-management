import { FULL_MONTHS, NUM_MONTHS } from "@/app/constants";
import { ErrorMessage } from "@/components/Message";
import { Separator } from "@/components/ui/separator";
import { getShiftsInDateRange } from "@/data-access/employee";
import { getFirstReportDate } from "@/data-access/report";
import { getCurrentSession } from "@/lib/auth/session";
import { TotalHoursTips } from "@/types";
import { hasAccess } from "@/utils/access-control";
import {
  getHoursTipsBreakdownInDayRange,
  getPeriodsByMonthAndYear,
} from "@/utils/hours-tips";
import { authenticatedRateLimit } from "@/utils/rate-limiter";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { CalendarDays } from "lucide-react";
import moment from "moment-timezone";
import { notFound, redirect } from "next/navigation";
import { DataTable } from "../_components/data-table";
import { HoursTipsTable } from "../_components/hours-tips-table";

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

  const today = moment.tz("America/Vancouver").startOf("day").toDate();
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

  const periods = getPeriodsByMonthAndYear(year, month - 1);

  const [firstPeriodEmployeeShifts, secondPeriodEmployeeShifts] =
    await Promise.all([
      getShiftsInDateRange(periods[0]),
      getShiftsInDateRange(periods[1]),
    ]);

  const hoursTipsBreakdowns = [
    getHoursTipsBreakdownInDayRange(periods[0], firstPeriodEmployeeShifts),
    getHoursTipsBreakdownInDayRange(periods[1], secondPeriodEmployeeShifts),
  ];

  const totalHoursTips: TotalHoursTips[] = [];
  for (const hoursTipsBreakdown of hoursTipsBreakdowns) {
    for (const data of hoursTipsBreakdown.hoursBreakdown) {
      const index = totalHoursTips.findIndex(
        (total) => total.userId === data.userId,
      );

      if (index === -1) {
        totalHoursTips.push({
          userId: data.userId,
          name: data.userName,
          image: data.image,
          totalHours: data.total,
          totalTips: 0,
        });
      } else {
        totalHoursTips[index].totalHours += data.total;
      }
    }

    for (const data of hoursTipsBreakdown.tipsBreakdown) {
      const index = totalHoursTips.findIndex(
        (total) => total.userId === data.userId,
      );

      if (index === -1) {
        totalHoursTips.push({
          userId: data.userId,
          name: data.userName,
          image: data.image,
          totalHours: 0,
          totalTips: data.total,
        });
      } else {
        totalHoursTips[index].totalTips += data.total;
      }
    }
  }

  return (
    <div className="space-y-8">
      <h2 className="flex items-center gap-2 text-base">
        {FULL_MONTHS[month - 1]} {year}
      </h2>

      <div className="bg-muted/50 w-full max-w-2xl space-y-2 rounded-lg p-4">
        <h3 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          Summary
        </h3>
        <HoursTipsTable data={totalHoursTips} />
      </div>

      <div className="bg-muted/50 space-y-4 rounded-lg p-4">
        <h3 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          Hours breakdown
        </h3>

        {periods.map((period, index) => (
          <div key={index} className="space-y-3">
            <h4 className="flex items-center gap-2 text-sm font-medium">
              <CalendarDays className="text-primary size-4" />
              <span>{moment(period.start).format("MMM D")}</span>
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
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
              <div className="text-muted-foreground p-2 text-sm">
                No record found for this period
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-muted/50 space-y-4 rounded-lg p-4">
        <h3 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          Tips breakdown
        </h3>

        {periods.map((period, index) => (
          <div key={index} className="space-y-3">
            <h4 className="flex items-center gap-2 text-sm">
              <CalendarDays className="text-primary size-4" />
              <span>{moment(period.start).format("MMM D")}</span>
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
              <span>{moment(period.end).format("MMM D")}</span>
            </h4>

            {hoursTipsBreakdowns[index].tipsBreakdown.length > 0 ? (
              <>
                <DataTable
                  dateRange={period}
                  data={hoursTipsBreakdowns[index].tipsBreakdown}
                  isMoney
                />

                <Separator />
              </>
            ) : (
              <div className="text-muted-foreground p-2 text-sm">
                No record found for this period
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
