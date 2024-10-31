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
import { GoBackButton } from "@/components/GoBackButton";
import { DataTable } from "../_components/DataTable";
import { Separator } from "@/components/ui/separator";
import { TotalHoursTips } from "@/types";

type Params = Promise<{ yearMonth: string[] }>;

export default async function Page(props: { params: Params }) {
  const { session, user } = await getCurrentSession();
  if (!session) redirect("/login");
  if (user.accountStatus !== "active") return notFound();
  if (!hasAccess(user.role, "/admin/hours&tips")) return notFound();

  const params = await props.params;
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
      >
        Current biweekly period
      </GoBackButton>

      <h2 className="font-semibold">
        {FULL_MONTHS[month - 1]} {year}
      </h2>

      <div className="w-fit rounded-md border p-2 shadow-md">
        <h3 className="text-sm font-medium">Total hours and tips</h3>

        <HoursTipsTable data={totalHoursTips} />
      </div>

      <div className="space-y-2 rounded-md border p-2 shadow-md">
        <h3 className="text-sm font-medium">Hours breakdown</h3>

        {periods.map((period, index) => (
          <div key={index} className="space-y-3">
            <h4 className="text-sm font-medium">
              {moment(period.start).format("MMM D")} -{" "}
              {moment(period.end).format("MMM D")}
            </h4>

            {hoursTipsBreakdowns[index].hoursBreakdown.length > 0 ? (
              <DataTable
                dateRange={period}
                data={hoursTipsBreakdowns[index].hoursBreakdown}
              />
            ) : (
              <div className="text-sm">No record found for this period</div>
            )}

            <Separator />
          </div>
        ))}
      </div>

      <div className="space-y-2 rounded-md border p-2 shadow-md">
        <h3 className="text-sm font-medium">Tips breakdown</h3>

        {periods.map((period, index) => (
          <div key={index} className="space-y-3">
            <h4 className="text-sm font-medium">
              {moment(period.start).format("MMM D")} -{" "}
              {moment(period.end).format("MMM D")}
            </h4>

            {hoursTipsBreakdowns[index].tipsBreakdown.length > 0 ? (
              <DataTable
                dateRange={period}
                data={hoursTipsBreakdowns[index].tipsBreakdown}
              />
            ) : (
              <div className="text-sm">No record found for this period</div>
            )}

            <Separator />
          </div>
        ))}
      </div>
    </div>
  );
}
