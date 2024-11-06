import { FULL_MONTHS } from "@/app/constants";
import { ErrorMessage } from "@/components/Message";
import { Separator } from "@/components/ui/separator";
import { getReportsByDateRange } from "@/data-access/report";
import { getCurrentSession } from "@/lib/auth/session";
import { formatPriceWithDollar } from "@/lib/utils";
import { hasAccess } from "@/utils/access-control";
import { getDayRangeByMonthAndYear } from "@/utils/hours-tips";
import { authenticatedRateLimit } from "@/utils/rate-limiter";
import moment from "moment-timezone";
import { notFound, redirect } from "next/navigation";

export default async function Page() {
  const { session, user } = await getCurrentSession();
  if (!session) redirect("/login");
  if (user.accountStatus !== "active") return notFound();
  if (!hasAccess(user.role, "/admin/dashboard")) return notFound();

  if (!(await authenticatedRateLimit(user.id))) {
    return (
      <ErrorMessage message="Too many requests. Please try again later." />
    );
  }

  const today = moment().tz("America/Vancouver").startOf("day").toDate();
  const selectedYear = today.getFullYear();
  const selectedMonth = today.getMonth() + 1;

  const dateRange = getDayRangeByMonthAndYear(selectedYear, selectedMonth);
  const reports = await getReportsByDateRange(dateRange);

  const {
    totalSales,
    onlineSales,
    uberEatsSales,
    doorDashSales,
    skipTheDishesSales,
    ritualSales,
  } = reports.reduce(
    (acc, report) => {
      acc.totalSales += report.totalSales;
      acc.onlineSales +=
        report.uberEatsSales +
        report.doorDashSales +
        report.skipTheDishesSales +
        report.onlineSales;
      acc.uberEatsSales += report.uberEatsSales;
      acc.doorDashSales += report.doorDashSales;
      acc.skipTheDishesSales += report.skipTheDishesSales;
      acc.onlineSales += report.onlineSales;
      return acc;
    },
    {
      totalSales: 0,
      onlineSales: 0,
      uberEatsSales: 0,
      doorDashSales: 0,
      skipTheDishesSales: 0,
      ritualSales: 0,
    },
  );

  const instoreSales = totalSales - onlineSales;

  return (
    <section className="space-y-4">
      <h1 className="text-xl font-bold">Dashboard</h1>

      <Separator className="my-4" />

      <div className="space-y-2">
        <h2 className="flex gap-3 text-lg font-semibold">
          Sales
          <span className="font-normal text-muted-foreground">
            {FULL_MONTHS[selectedMonth - 1]} {selectedYear}
          </span>
        </h2>

        <h3 className="font-medium">Overview</h3>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2 rounded-md border p-2 shadow">
            <p className="font-semibold">Total Sales</p>
            <p className="text-lg text-muted-foreground">
              {formatPriceWithDollar(totalSales)}
            </p>
          </div>

          <div className="space-y-2 rounded-md border p-2 shadow">
            <p className="font-semibold">In-store Sales</p>
            <p className="text-lg text-muted-foreground">
              {formatPriceWithDollar(instoreSales)}
            </p>
          </div>

          <div className="space-y-2 rounded-md border p-2 shadow">
            <p className="font-semibold">Online Sales</p>
            <p className="text-lg text-muted-foreground">
              {formatPriceWithDollar(onlineSales)}
            </p>
          </div>
        </div>

        <h3 className="font-medium">Online</h3>
      </div>
    </section>
  );
}
