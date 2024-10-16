export type CashType =
  | "coin5c"
  | "coin10c"
  | "coin25c"
  | "coin1"
  | "coin2"
  | "bill5"
  | "bill10"
  | "bill20"
  | "bill50"
  | "bill100"
  | "roll5c"
  | "roll10c"
  | "roll25c"
  | "roll1"
  | "roll2";

export type SaleEmployee = {
  userId: string;
  fullDay: boolean;
  name: string;
};

export interface SaleReportCardRawData {
  date: Date;
  reporterName: string;
  totalSales: number;
  cardSales: number;
  expenses: number;
  expensesReason?: string | null;
  cardTips: number;
  cashTips: number;
  extraTips: number;
  cashInTill: number;
  startCash: number;
  uberEatsSales: number;
  doorDashSales: number;
  skipTheDishesSales: number;
  onlineSales: number;
  employees: SaleEmployee[];
}

export interface SaleReportCardProcessedData extends SaleReportCardRawData {
  inStoreSales: number;
  otherSales: number;
  cashSales: number;
  actualCash: number;
  totalTips: number;
  cashDifference: number;
  totalPeople: number;
  tipsPerPerson: number;
}
