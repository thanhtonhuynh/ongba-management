import { getFirstReportDate, getReportsForYears } from "@/data-access/report";
import { getAvailableYears } from "@/utils/sales-analytics";
import moment from "moment-timezone";
import { SalesAnalyticsDashboardClient } from "./sales-analytics-dashboard";

export async function SalesAnalyticsDashboard() {
  const currentYear = moment.tz("America/Vancouver").year();
  const firstReportDate = await getFirstReportDate();
  const availableYears = getAvailableYears(firstReportDate ?? null);

  // Fetch reports for all available years
  const reportsByYear = await getReportsForYears(availableYears);

  return (
    <SalesAnalyticsDashboardClient
      reportsByYear={reportsByYear}
      availableYears={availableYears}
      currentYear={currentYear}
    />
  );
}
