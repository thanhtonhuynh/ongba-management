"use client";

import { formatPriceWithDollar } from "@/lib/utils";
import { SalesAnalytics } from "@/utils/sales-analytics";

type SalesStatsProps = {
  analytics: SalesAnalytics;
};

export function SalesStats({ analytics }: SalesStatsProps) {
  const { bestSalesMonth, bestSalesDay, lowestSalesDay, averageDailySales } =
    analytics;

  return (
    <div className="grid grid-cols-2 gap-4 px-3 md:flex md:justify-between">
      <StatItem
        label="Best Sales Month"
        value={bestSalesMonth?.month ?? "—"}
        subValue={
          bestSalesMonth
            ? formatPriceWithDollar(bestSalesMonth.totalSales / 100)
            : undefined
        }
      />
      <StatItem
        label="Best Sales Day"
        value={bestSalesDay?.formattedDate ?? "—"}
        subValue={
          bestSalesDay
            ? formatPriceWithDollar(bestSalesDay.totalSales / 100)
            : undefined
        }
      />
      <StatItem
        label="Lowest Sales Day"
        value={lowestSalesDay?.formattedDate ?? "—"}
        subValue={
          lowestSalesDay
            ? formatPriceWithDollar(lowestSalesDay.totalSales / 100)
            : undefined
        }
      />
      <StatItem
        label="Average Daily Sales"
        value={
          averageDailySales > 0
            ? formatPriceWithDollar(averageDailySales / 100)
            : "—"
        }
      />
    </div>
  );
}

function StatItem({
  label,
  value,
  subValue,
}: {
  label: string;
  value: string;
  subValue?: string;
}) {
  return (
    <div>
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
      {subValue && <p className="text-muted-foreground text-xs">{subValue}</p>}
    </div>
  );
}
