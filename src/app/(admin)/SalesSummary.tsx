import { GoBackButton } from "@/components/buttons/GoBackButton";
import { CurrentTag } from "@/components/CurrentTag";
import { getReportsByDateRange } from "@/data-access/report";
import { formatPriceWithDollar } from "@/lib/utils";
import {
  getDayRangeByMonthAndYear,
  populateMonthSelectData,
} from "@/utils/hours-tips";
import { summarizeReports } from "@/utils/report";
import moment from "moment";
import { notFound } from "next/navigation";
import { FULL_MONTHS, NUM_MONTHS } from "../constants";
import { ViewPeriodsDialog } from "./ViewPeriodsDialog";

type SalesSummaryProps = {
  year: number;
  month: number;
};

export async function SalesSummary({ year, month }: SalesSummaryProps) {
  const { years } = await populateMonthSelectData();

  if (
    isNaN(year) ||
    isNaN(month) ||
    !years.includes(year) ||
    !NUM_MONTHS.includes(month)
  )
    notFound();

  const today = moment().tz("America/Vancouver").startOf("day").toDate();
  const dateRange = getDayRangeByMonthAndYear(year, month - 1);
  const reports = await getReportsByDateRange(dateRange);
  const sumData = summarizeReports(reports);
  const instoreSales = sumData.totalSales - sumData.onlineSales;

  return (
    <div className="space-y-4 rounded-lg border p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h6>Sales Summary</h6>
        {years.length > 0 && <ViewPeriodsDialog years={years} />}
      </div>

      {(year !== today.getFullYear() ||
        (year === today.getFullYear() && month !== today.getMonth() + 1)) && (
        <GoBackButton
          url={`/`}
          variant={`outline`}
          className="gap-2"
          size={"sm"}
        >
          Back to current
        </GoBackButton>
      )}

      <div className="flex items-center gap-2 font-semibold">
        {FULL_MONTHS[month - 1]} {year}
        {year === today.getFullYear() && month === today.getMonth() + 1 && (
          <CurrentTag />
        )}
      </div>

      <h3 className="">Overview</h3>

      <div className="grid gap-2 md:grid-cols-3">
        <div className="flex flex-col justify-center space-y-3 rounded-md border p-4 shadow-sm">
          <p className="font-semibold">Total Sales</p>
          <p className="text-muted-foreground text-lg font-medium">
            {formatPriceWithDollar(sumData.totalSales)}
          </p>
        </div>

        <div className="place-content-center space-y-3 rounded-md border p-4 text-sm shadow-sm">
          <p>In-store Sales</p>

          <div className="text-muted-foreground space-y-1 font-medium">
            {formatPriceWithDollar(instoreSales)}{" "}
            {sumData.totalSales > 0 && (
              <span className="text-xs font-medium text-blue-500">
                ({((instoreSales / sumData.totalSales) * 100).toFixed(2)}
                %)
              </span>
            )}
          </div>
        </div>

        <div className="place-content-center space-y-3 rounded-md border p-4 text-sm shadow-sm">
          <p>Online Sales</p>

          <div className="text-muted-foreground space-y-1 font-medium">
            {formatPriceWithDollar(sumData.onlineSales)}{" "}
            {sumData.totalSales > 0 && (
              <span className="text-xs font-medium text-blue-500">
                ({((sumData.onlineSales / sumData.totalSales) * 100).toFixed(2)}
                %)
              </span>
            )}
          </div>
        </div>
      </div>

      <h3>Online Sales</h3>

      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
        <div className="text-muted-foreground space-y-2 rounded-md border p-4 text-sm shadow-sm">
          <p className="text-green-600">UberEats</p>

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

        <div className="text-muted-foreground space-y-2 rounded-md border p-4 text-sm shadow-sm">
          <p className="text-red-600">DoorDash</p>

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

        <div className="text-muted-foreground space-y-2 rounded-md border p-4 text-sm shadow-sm">
          <p className="text-sky-500">Ritual</p>

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

        <div className="text-muted-foreground space-y-2 rounded-md border p-4 text-sm shadow-sm">
          <p className="text-orange-500">SkipTheDishes</p>

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
