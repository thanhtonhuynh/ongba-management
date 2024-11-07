import { getReportsByDateRange } from "@/data-access/report";
import {
  getDayRangeByMonthAndYear,
  populateMonthSelectData,
} from "@/utils/hours-tips";
import moment from "moment";
import { FULL_MONTHS } from "../constants";
import { formatPriceWithDollar } from "@/lib/utils";
import { summarizeReports } from "@/utils/report";
import { ViewPeriodsDialog } from "./ViewPeriodsDialog";
import { GoBackButton } from "@/components/buttons/GoBackButton";

type SalesSummaryProps = {
  year: number;
  month: number;
};

export async function SalesSummary({ year, month }: SalesSummaryProps) {
  const { years } = await populateMonthSelectData();
  const today = moment().tz("America/Vancouver").startOf("day").toDate();
  const dateRange = getDayRangeByMonthAndYear(year, month);
  const reports = await getReportsByDateRange(dateRange);
  const sumData = summarizeReports(reports);
  const instoreSales = sumData.totalSales - sumData.onlineSales;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Sales Summary</h2>
        {years.length > 0 && <ViewPeriodsDialog years={years} />}
      </div>

      {(year !== today.getFullYear() ||
        (year === today.getFullYear() && month !== today.getMonth() + 1)) && (
        <GoBackButton
          url={`/admin`}
          variant={`outline`}
          className="gap-1"
          size={"sm"}
        >
          Back to current
        </GoBackButton>
      )}

      <div className="flex items-center gap-2 font-semibold">
        {FULL_MONTHS[month - 1]} {year}
        {year === today.getFullYear() && month === today.getMonth() + 1 && (
          <span className="rounded-md border bg-muted px-2 py-1 text-xs">
            Current
          </span>
        )}
      </div>

      <h3 className="font-medium">Overview</h3>

      <div className="grid gap-2 md:grid-cols-3">
        <div className="flex flex-col justify-center space-y-3 rounded-md border p-4 shadow">
          <p className="font-semibold">Total Sales</p>
          <p className="font-medium text-muted-foreground">
            {formatPriceWithDollar(sumData.totalSales)}
          </p>
        </div>

        <div className="space-y-3 rounded-md border p-4 shadow">
          <p className="font-medium">In-store Sales</p>

          <div className="space-y-1 text-muted-foreground">
            <p className="font-medium">{formatPriceWithDollar(instoreSales)}</p>

            {sumData.totalSales > 0 && (
              <p className="text-sm">
                <span className="font-medium text-blue-500">
                  {((instoreSales / sumData.totalSales) * 100).toFixed(2)}%{" "}
                </span>
                <span>of Total Sales</span>
              </p>
            )}
          </div>
        </div>

        <div className="space-y-3 rounded-md border p-4 shadow">
          <p className="font-medium">Online Sales</p>

          <div className="space-y-1 text-muted-foreground">
            <p className="font-medium">
              {formatPriceWithDollar(sumData.onlineSales)}
            </p>

            {sumData.totalSales > 0 && (
              <p className="text-sm">
                <span className="font-medium text-blue-500">
                  {((sumData.onlineSales / sumData.totalSales) * 100).toFixed(
                    2,
                  )}
                  %{" "}
                </span>
                <span>of Total Sales</span>
              </p>
            )}
          </div>
        </div>
      </div>

      <h3 className="font-medium">Online Sales</h3>

      <div className="grid gap-2 md:grid-cols-4">
        <div className="space-y-2 rounded-md border p-4 text-muted-foreground shadow">
          <p className="font-medium text-green-600">UberEats</p>

          <div className="space-y-1">
            <p className="font-medium">
              {formatPriceWithDollar(sumData.uberEatsSales)}
            </p>

            {sumData.onlineSales > 0 && (
              <p className="text-sm">
                <span className="font-medium text-green-600">
                  {(
                    (sumData.uberEatsSales / sumData.onlineSales) *
                    100
                  ).toFixed(2)}
                  %{" "}
                </span>
                <span>of Online Sales</span>
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2 rounded-md border p-4 text-muted-foreground shadow">
          <p className="font-medium text-red-600">DoorDash</p>

          <div className="space-y-1">
            <p className="font-medium">
              {formatPriceWithDollar(sumData.doorDashSales)}
            </p>

            {sumData.onlineSales > 0 && (
              <p className="text-sm">
                <span className="font-medium text-red-600">
                  {(
                    (sumData.doorDashSales / sumData.onlineSales) *
                    100
                  ).toFixed(2)}
                  %{" "}
                </span>
                <span>of Online Sales</span>
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2 rounded-md border p-4 text-muted-foreground shadow">
          <p className="font-medium text-sky-500">Ritual</p>

          <div className="space-y-1">
            <p className="font-medium">
              {formatPriceWithDollar(sumData.ritualSales)}
            </p>

            {sumData.onlineSales > 0 && (
              <p className="text-sm">
                <span className="font-medium text-sky-500">
                  {((sumData.ritualSales / sumData.onlineSales) * 100).toFixed(
                    2,
                  )}
                  %{" "}
                </span>
                <span>of Online Sales</span>
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2 rounded-md border p-4 text-muted-foreground shadow">
          <p className="font-medium text-orange-500">SkipTheDishes</p>

          <div className="space-y-1">
            <p className="font-medium">
              {formatPriceWithDollar(sumData.skipTheDishesSales)}
            </p>

            {sumData.onlineSales > 0 && (
              <p className="text-sm">
                <span className="font-medium text-orange-500">
                  {(
                    (sumData.skipTheDishesSales / sumData.onlineSales) *
                    100
                  ).toFixed(2)}
                  %{" "}
                </span>
                <span>of Online Sales</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
