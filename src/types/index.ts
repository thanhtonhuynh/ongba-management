import { Expense } from "@prisma/client";

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
  hour: number;
  name: string;
  image?: string;
};

export interface SaleReportCardRawData {
  date: Date;
  reporterName: string;
  reporterImage: string | null;
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
  cashOut: number;
  totalHours: number;
  tipsPerHour: number;
}

export type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type ShiftHours = {
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  sunday: number;
};

export type DayRange = {
  start: Date;
  end: Date;
};

export type TotalHoursTips = {
  userId: string;
  name: string;
  image: string;
  totalHours: number;
  totalTips: number;
};

export type EmployeeShift = {
  userId: string;
  date: Date;
  hours: number;
  tips: number;
  user: {
    name: string;
    image: string | null;
  };
};

export type BreakdownData = {
  userId: string;
  userName: string;
  image: string;
  keyData: number[];
  total: number;
};

export type CashFlowRawData = {
  id: string;
  date: Date;
  totalSales: number;
  cardSales: number;
  uberEatsSales: number;
  doorDashSales: number;
  skipTheDishesSales: number;
  onlineSales: number;
  expenses: number;
};

export type CashFlowData = CashFlowRawData & {
  actualCash: number;
  totalRevenue: number;
};

export type UserShift = {
  id: string;
  date: Date;
  hours: number;
  tips: number;
};

export type YearCashFlowData = {
  month: number;
  totalSales: number;
  totalUberEatsSales: number;
  totalDoorDashSales: number;
  totalSkipTheDishesSales: number;
  totalOnlineSales: number;
  totalInstoreExpenses: number;
  totalInStoreSales: number;
  netIncome: number;
  totalMonthMainExpenses: number;
  totalExpenses: number;
};

export type MonthlyExpense = {
  month: number;
  monthExpenses: Expense[];
  totalExpenses: number;
};
