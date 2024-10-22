import { CashFlowRawData } from "@/types";

export function processCashFlowData(rawReports: CashFlowRawData[]) {
  return rawReports.map((report) => {
    const actualCash =
      report.totalSales -
      report.uberEatsSales -
      report.doorDashSales -
      report.skipTheDishesSales -
      report.onlineSales -
      report.cardSales -
      report.expenses;

    const totalRevenue =
      report.cardSales +
      actualCash +
      report.uberEatsSales +
      report.doorDashSales +
      report.skipTheDishesSales +
      report.onlineSales +
      report.expenses;

    return {
      ...report,
      actualCash,
      totalRevenue,
    };
  });
}
