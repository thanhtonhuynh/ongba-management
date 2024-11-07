import {
  CashFlowRawData,
  SaleReportCardProcessedData,
  SaleReportCardRawData,
} from "@/types";

export function processReportDataForView(
  rawData: SaleReportCardRawData,
): SaleReportCardProcessedData {
  const otherSales =
    Number(rawData.uberEatsSales) +
    Number(rawData.doorDashSales) +
    Number(rawData.skipTheDishesSales) +
    Number(rawData.onlineSales);

  const inStoreSales = rawData.totalSales - otherSales;

  const cashSales = inStoreSales - rawData.cardSales;

  const actualCash = cashSales - rawData.expenses;

  const totalTips =
    Number(rawData.cardTips) +
    Number(rawData.cashTips) +
    Number(rawData.extraTips);

  const cashDifference = rawData.cashInTill - rawData.startCash - actualCash;

  const cashOut =
    Number(rawData.cashInTill) -
    Number(rawData.startCash) +
    Number(rawData.cashTips);

  const totalPeople = rawData.employees.reduce(
    (acc, emp) => acc + (emp.fullDay ? 1 : 0.5),
    0,
  );

  const tipsPerPerson = totalTips / (totalPeople >= 1 ? totalPeople : 1);

  const processedData = {
    ...rawData,
    inStoreSales,
    otherSales,
    cashSales,
    actualCash,
    totalTips,
    cashDifference,
    cashOut,
    totalPeople: totalPeople >= 1 ? totalPeople : 1,
    tipsPerPerson,
  };

  return processedData;
}

export function summarizeReports(reports: CashFlowRawData[]) {
  return reports.reduce(
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
}
