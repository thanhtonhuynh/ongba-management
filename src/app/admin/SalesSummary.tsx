import { getReportsByDateRange } from "@/data-access/report";
import { getDayRangeByMonthAndYear } from "@/utils/hours-tips";
import moment from "moment";
import { FULL_MONTHS } from "../constants";
import { formatPriceWithDollar } from "@/lib/utils";

export async function SalesSummary() {
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
      acc.ritualSales += report.onlineSales;
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
    <div className="space-y-4">
      <h2 className="flex gap-3 text-xl font-semibold">
        Sales
        <span className="font-normal text-muted-foreground">
          {FULL_MONTHS[selectedMonth - 1]} {selectedYear}
        </span>
      </h2>

      <h3 className="text-lg font-medium">Overview</h3>

      <div className="grid gap-2 md:grid-cols-3">
        <div className="flex flex-col justify-center space-y-2 rounded-md border p-4 shadow">
          <p className="font-semibold">Total Sales</p>
          <p className="font-medium text-muted-foreground">
            {formatPriceWithDollar(totalSales)}
          </p>
        </div>

        <div className="space-y-2 rounded-md border p-4 text-muted-foreground shadow">
          <p className="font-medium">In-store Sales</p>
          <div className="flex items-baseline space-x-3">
            <p className="font-medium">{formatPriceWithDollar(instoreSales)}</p>
            <p className="text-sm">
              <span className="font-medium text-blue-500">
                {((instoreSales / totalSales) * 100).toFixed(2)}%{" "}
              </span>
              <span>of Total Sales</span>
            </p>
          </div>
        </div>

        <div className="space-y-2 rounded-md border p-4 text-muted-foreground shadow">
          <p className="font-medium">Online Sales</p>
          <div className="flex items-baseline space-x-3">
            <p className="font-medium">{formatPriceWithDollar(onlineSales)}</p>
            <p className="text-sm">
              <span className="font-medium text-blue-500">
                {((onlineSales / totalSales) * 100).toFixed(2)}%{" "}
              </span>
              <span>of Total Sales</span>
            </p>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-medium">Online Sales</h3>

      <div className="grid gap-2 md:grid-cols-4">
        <div className="space-y-2 rounded-md border p-4 text-muted-foreground shadow">
          <p className="text-green-600">UberEats</p>
          <div className="flex items-baseline space-x-3">
            <p className="font-medium">
              {formatPriceWithDollar(uberEatsSales)}
            </p>
            <p className="text-sm">
              <span className="font-medium text-green-600">
                {((uberEatsSales / onlineSales) * 100).toFixed(2)}%{" "}
              </span>
              <span>of Online Sales</span>
            </p>
          </div>
        </div>

        <div className="space-y-2 rounded-md border p-4 text-muted-foreground shadow">
          <p className="text-red-600">DoorDash</p>
          <div className="flex items-baseline space-x-3">
            <p className="font-medium">
              {formatPriceWithDollar(doorDashSales)}
            </p>
            <p className="text-sm">
              <span className="font-medium text-red-600">
                {((doorDashSales / onlineSales) * 100).toFixed(2)}%{" "}
              </span>
              <span>of Online Sales</span>
            </p>
          </div>
        </div>

        <div className="space-y-2 rounded-md border p-4 text-muted-foreground shadow">
          <p className="text-sky-500">Ritual</p>
          <div className="flex items-baseline space-x-3">
            <p className="font-medium">{formatPriceWithDollar(ritualSales)}</p>
            <p className="text-sm">
              <span className="font-medium text-sky-500">
                {((ritualSales / onlineSales) * 100).toFixed(2)}%{" "}
              </span>
              <span>of Online Sales</span>
            </p>
          </div>
        </div>

        <div className="space-y-2 rounded-md border p-4 text-muted-foreground shadow">
          <p className="text-orange-500">SkipTheDishes</p>
          <div className="flex items-baseline space-x-3">
            <p className="font-medium">
              {formatPriceWithDollar(skipTheDishesSales)}
            </p>
            <p className="text-sm">
              <span className="font-medium text-orange-500">
                {((skipTheDishesSales / onlineSales) * 100).toFixed(2)}%{" "}
              </span>
              <span>of Online Sales</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
