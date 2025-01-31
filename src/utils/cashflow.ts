import { CashFlowRawData, YearCashFlowData } from "@/types";

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

// for each month of the year, calculate the total revenue, total expenses, and net income
// return an array of 12 objects, each object has the month, total sales, total uber eats sales, total door dash sales, total skip the dishes sales, total online sales, total expenses, total in-store sales, and net income
export function processYearCashFlowData(
  rawReports: CashFlowRawData[],
): YearCashFlowData[] {
  const yearCashFlowData = Array(12)
    .fill(null)
    .map((_, month) => {
      const monthReports = rawReports.filter(
        (report) => report.date.getMonth() === month,
      );

      const totalSales = monthReports.reduce(
        (acc, report) => acc + report.totalSales,
        0,
      );
      const totalUberEatsSales = monthReports.reduce(
        (acc, report) => acc + report.uberEatsSales,
        0,
      );
      const totalDoorDashSales = monthReports.reduce(
        (acc, report) => acc + report.doorDashSales,
        0,
      );
      const totalSkipTheDishesSales = monthReports.reduce(
        (acc, report) => acc + report.skipTheDishesSales,
        0,
      );
      const totalOnlineSales = monthReports.reduce(
        (acc, report) => acc + report.onlineSales,
        0,
      );
      const totalExpenses = monthReports.reduce(
        (acc, report) => acc + report.expenses,
        0,
      );
      const totalInStoreSales =
        totalSales -
        totalUberEatsSales -
        totalDoorDashSales -
        totalSkipTheDishesSales -
        totalOnlineSales;
      const netIncome = totalSales - totalExpenses;

      return {
        month: month + 1,
        totalSales,
        totalUberEatsSales,
        totalDoorDashSales,
        totalSkipTheDishesSales,
        totalOnlineSales,
        totalExpenses,
        totalInStoreSales,
        netIncome,
      };
    });

  return yearCashFlowData;
}
