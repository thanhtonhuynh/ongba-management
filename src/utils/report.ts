import { SaleReportCardProcessedData, SaleReportCardRawData } from "@/types";

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
