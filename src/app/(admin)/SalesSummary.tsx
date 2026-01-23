import { GoBackButton } from "@/components/buttons/GoBackButton";
import { CurrentTag } from "@/components/CurrentTag";
import { getReportsByDateRange } from "@/data-access/report";
import { formatPriceWithDollar } from "@/lib/utils";
import {
  getDayRangeByMonthAndYear,
  populateMonthSelectData,
} from "@/utils/hours-tips";
import { summarizeReports } from "@/utils/report";
import {
  DollarCircleIcon,
  SmartPhone01Icon,
  Store01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
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
    <div className="space-y-4">
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
          View current
        </GoBackButton>
      )}

      <div className="flex items-center gap-2 text-lg font-semibold">
        {FULL_MONTHS[month - 1]} {year}
        {year === today.getFullYear() && month === today.getMonth() + 1 && (
          <CurrentTag />
        )}
      </div>

      {/* Overview Section */}
      <div className="bg-muted/50 space-y-3 rounded-lg p-4">
        <h3 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          Overview
        </h3>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
              <HugeiconsIcon
                icon={DollarCircleIcon}
                className="text-muted-foreground size-5"
              />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Total Sales</p>
              <p className="text-sm font-semibold">
                {formatPriceWithDollar(sumData.totalSales / 100)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
              <HugeiconsIcon
                icon={Store01Icon}
                className="text-muted-foreground size-5"
              />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">In-store Sales</p>
              <p className="text-sm font-medium">
                {formatPriceWithDollar(instoreSales / 100)}
                {sumData.totalSales > 0 && (
                  <span className="text-primary ml-1 text-xs">
                    ({((instoreSales / sumData.totalSales) * 100).toFixed(1)}%)
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
              <HugeiconsIcon
                icon={SmartPhone01Icon}
                className="text-muted-foreground size-5"
              />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Online Sales</p>
              <p className="text-sm font-medium">
                {formatPriceWithDollar(sumData.onlineSales / 100)}
                {sumData.totalSales > 0 && (
                  <span className="text-primary ml-1 text-xs">
                    (
                    {((sumData.onlineSales / sumData.totalSales) * 100).toFixed(
                      1,
                    )}
                    %)
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Online Sales Breakdown */}
      <div className="bg-muted/50 space-y-3 rounded-lg p-4">
        <h3 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          Online Sales
        </h3>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
              <span className="text-lg text-green-600">U</span>
            </div>
            <div>
              <p className="text-xs text-green-600">UberEats</p>
              <p className="text-sm font-medium">
                {formatPriceWithDollar(sumData.uberEatsSales / 100)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
              <span className="text-lg text-red-600">D</span>
            </div>
            <div>
              <p className="text-xs text-red-600">DoorDash</p>
              <p className="text-sm font-medium">
                {formatPriceWithDollar(sumData.doorDashSales / 100)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10">
              <span className="text-lg text-sky-500">R</span>
            </div>
            <div>
              <p className="text-xs text-sky-500">Ritual</p>
              <p className="text-sm font-medium">
                {formatPriceWithDollar(sumData.ritualSales / 100)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
              <span className="text-lg text-orange-500">S</span>
            </div>
            <div>
              <p className="text-xs text-orange-500">SkipTheDishes</p>
              <p className="text-sm font-medium">
                {formatPriceWithDollar(sumData.skipTheDishesSales / 100)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
