import { CashFlowRawData, YearCashFlowData } from "@/types";
import { Expense } from "@prisma/client";

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

export function processYearCashFlowData(
  rawYearReports: CashFlowRawData[],
  yearMainExpenses: Expense[],
): YearCashFlowData[] {
  const yearCashFlowData = Array(12)
    .fill(null)
    .map((_, month) => {
      const monthReports = rawYearReports.filter(
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
      const totalInstoreExpenses = monthReports.reduce(
        (acc, report) => acc + report.expenses,
        0,
      );
      const totalInStoreSales =
        totalSales -
        totalUberEatsSales -
        totalDoorDashSales -
        totalSkipTheDishesSales -
        totalOnlineSales;

      const monthMainExpenses = yearMainExpenses.filter(
        (expense) => expense.date.getMonth() === month,
      );
      const totalMonthMainExpenses = monthMainExpenses.reduce(
        (acc, expense) =>
          acc + expense.entries.reduce((acc, entry) => acc + entry.amount, 0),
        0,
      );

      const totalExpenses = totalInstoreExpenses + totalMonthMainExpenses;

      const netIncome = totalSales - totalExpenses;
      return {
        month: month + 1,
        totalInStoreSales,
        totalUberEatsSales,
        totalOnlineSales,
        totalDoorDashSales,
        totalSkipTheDishesSales,
        totalSales,
        totalInstoreExpenses,
        totalMonthMainExpenses,
        totalExpenses,
        netIncome,
      };
    });

  return yearCashFlowData;
}
