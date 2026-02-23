import { ICONS } from "@/constants/icons";
import { CashType } from "@/types";

export const NUM_MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export const FULL_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** Abbreviated month names. E.g., Jan, Feb, Mar, etc. */
export const SHORT_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const MONEY_VALUES = new Map([
  ["bill100", { label: "$100", value: 100.0 }],
  ["bill50", { label: "$50", value: 50.0 }],
  ["bill20", { label: "$20", value: 20.0 }],
  ["bill10", { label: "$10", value: 10.0 }],
  ["bill5", { label: "$5", value: 5.0 }],
  ["coin2", { label: "$2", value: 2.0 }],
  ["coin1", { label: "$1", value: 1.0 }],
  ["coin25c", { label: "25¢", value: 0.25 }],
  ["coin10c", { label: "10¢", value: 0.1 }],
  ["coin5c", { label: "5¢", value: 0.05 }],
  ["roll2", { label: "$2", value: 50.0 }],
  ["roll1", { label: "$1", value: 25.0 }],
  ["roll25c", { label: "25¢", value: 10.0 }],
  ["roll10c", { label: "10¢", value: 5.0 }],
  ["roll5c", { label: "5¢", value: 2.0 }],
]);

export const MONEY_FIELDS = Array.from(MONEY_VALUES.keys()) as CashType[];
export const COIN_FIELDS = MONEY_FIELDS.filter((key) => key.startsWith("coin"));
export const BILL_FIELDS = MONEY_FIELDS.filter((key) => key.startsWith("bill"));
export const ROLL_FIELDS = MONEY_FIELDS.filter((key) => key.startsWith("roll"));

export const staffMenuItems = [
  { title: "Sales Reports", url: "/sales-reports", icon: ICONS.REPORT },
  { title: "Cash Calculator", url: "/cash-calculator", icon: ICONS.CALCULATOR },
  { title: "My Shifts", url: "/my-shifts", icon: ICONS.CALENDAR },
  { title: "Team", url: "/team", icon: ICONS.USER_GROUP },
];

export const adminMenuItems = [
  { title: "Hours & Tips", url: "/hours&tips", icon: ICONS.HOURGLASS },
  { title: "Cashflow", url: "/cashflow", icon: ICONS.CASHFLOW },
  { title: "Expenses", url: "/expenses", icon: ICONS.EXPENSE },
  { title: "Roles & Permissions", url: "/roles", icon: ICONS.SHIELD },
  { title: "Store Settings", url: "/store-settings", icon: ICONS.STORE_SETTINGS },
];
