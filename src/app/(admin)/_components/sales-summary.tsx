import { CurrentBadge } from "@/components/shared";
import { Typography } from "@/components/shared/typography";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Platform, getPlatformById } from "@/constants/platforms";
import { getReportsByDateRange } from "@/data-access/report";
import { formatPriceWithDollar } from "@/lib/utils";
import { getDayRangeByMonthAndYear, populateMonthSelectData } from "@/utils/hours-tips";
import { summarizeReports } from "@/utils/report";
import { DollarCircleIcon, SmartPhone01Icon, Store01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import moment from "moment";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FULL_MONTHS, NUM_MONTHS } from "../../constants";
import { ViewPeriodsDialog } from "./ViewPeriodsDialog";

type SalesSummaryProps = {
  year: number;
  month: number;
};

export async function SalesSummary({ year, month }: SalesSummaryProps) {
  const { years } = await populateMonthSelectData();

  if (isNaN(year) || isNaN(month) || !years.includes(year) || !NUM_MONTHS.includes(month))
    notFound();

  const today = moment().tz("America/Vancouver").startOf("day").toDate();
  const dateRange = getDayRangeByMonthAndYear(year, month - 1);
  const reports = await getReportsByDateRange(dateRange);
  const sumData = summarizeReports(reports);
  const instoreSales = sumData.totalSales - sumData.onlineSales;

  // Derive platforms from actual data so historical periods show all platforms that were used
  const platformsInData = Object.keys(sumData.platformTotals)
    .map((id) => getPlatformById(id))
    .filter((p): p is Platform => p !== undefined);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between gap-3">
        <CardTitle>Sales Summary</CardTitle>
        {years.length > 0 && <ViewPeriodsDialog years={years} />}
      </CardHeader>

      <CardContent className="space-y-3">
        <Typography variant="h2" className="flex items-center gap-2">
          {FULL_MONTHS[month - 1]} {year}
          {year === today.getFullYear() && month === today.getMonth() + 1 && <CurrentBadge />}
        </Typography>

        {/* Overview Section */}
        <div className="space-y-3">
          <Typography variant="h3">Overview</Typography>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                <HugeiconsIcon icon={DollarCircleIcon} className="text-muted-foreground size-5" />
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
                <HugeiconsIcon icon={Store01Icon} className="text-muted-foreground size-5" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">In-store Sales</p>
                <p className="text-sm font-medium">
                  {formatPriceWithDollar(instoreSales / 100)}
                  {sumData.totalSales > 0 && (
                    <span className="text-primary ml-1 text-xs">
                      ({((instoreSales / sumData.totalSales) * 100).toFixed(1)}
                      %)
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                <HugeiconsIcon icon={SmartPhone01Icon} className="text-muted-foreground size-5" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Online Sales</p>
                <p className="text-sm font-medium">
                  {formatPriceWithDollar(sumData.onlineSales / 100)}
                  {sumData.totalSales > 0 && (
                    <span className="text-primary ml-1 text-xs">
                      ({((sumData.onlineSales / sumData.totalSales) * 100).toFixed(1)}
                      %)
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Online Sales Breakdown */}
        {platformsInData.length > 0 && (
          <div className="space-y-3">
            <Typography variant="h3">Online Sales</Typography>

            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: `repeat(${Math.min(platformsInData.length, 4)}, minmax(0, 1fr))`,
              }}
            >
              {platformsInData.map((platform) => {
                const platformTotal = sumData.platformTotals[platform.id] ?? 0;
                return (
                  <div key={platform.id} className="flex items-center gap-3">
                    <Image
                      src={platform.iconSrc}
                      alt={`${platform.label} icon`}
                      width={30}
                      height={30}
                    />
                    <div>
                      <p className="text-muted-foreground text-xs">{platform.label}</p>
                      <p className="text-sm font-medium">
                        {formatPriceWithDollar(platformTotal / 100)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
