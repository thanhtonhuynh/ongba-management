import { ErrorMessage } from "@/components/message";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getShiftsInDateRange } from "@/data-access/employee";
import { getCurrentSession } from "@/lib/auth/session";
import { TotalHoursTips } from "@/types";
import { hasAccess } from "@/utils/access-control";
import {
  getHoursTipsBreakdownInDayRange,
  getTodayBiweeklyPeriod,
} from "@/utils/hours-tips";
import { authenticatedRateLimit } from "@/utils/rate-limiter";
import { notFound, redirect } from "next/navigation";
import { DataTable } from "./_components/data-table";
import { HoursTipsTable } from "./_components/hours-tips-table";

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
    <div className="space-y-6">
      {/* <h2 className="flex items-center gap-2 text-base">
        <CalendarDays className="text-primary size-4" />
        <span>{moment(todayBiweeklyPeriod.start).format("MMM D")}</span>
        <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
        <span>{moment(todayBiweeklyPeriod.end).format("MMM D, YYYY")}</span>
      </h2> */}

      <Card className="gap-4">
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>

        <CardContent>
          <HoursTipsTable data={totalHoursTips} />
        </CardContent>
      </Card>

      <Card className="gap-4">
        <CardHeader>
          <CardTitle>Hours</CardTitle>
        </CardHeader>

        <CardContent>
          <DataTable dateRange={todayBiweeklyPeriod} data={hoursBreakdown} />
        </CardContent>
      </Card>

      <Card className="gap-4">
        <CardHeader>
          <CardTitle>Tips</CardTitle>
        </CardHeader>

        <CardContent>
          <DataTable
            dateRange={todayBiweeklyPeriod}
            data={tipsBreakdown}
            isMoney
          />
        </CardContent>
      </Card>
    </div>
  );
}
