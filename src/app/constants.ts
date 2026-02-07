import { CashType } from "@/types";
import {
  Calculator,
  CalendarCheck,
  ClipboardList,
  Hourglass,
  Landmark,
  ShoppingBasket,
  Store,
  Users,
} from "lucide-react";

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
  { title: "Sales reports", url: "/report", icon: ClipboardList },
  { title: "Cash calculator", url: "/cash-calculator", icon: Calculator },
  { title: "My shifts", url: "/my-shifts", icon: CalendarCheck },
  { title: "Team", url: "/team", icon: Users },
];

export const adminMenuItems = [
  { title: "Hours & tips", url: "/hours&tips", icon: Hourglass },
  { title: "Cashflow", url: "/cashflow", icon: Landmark },
  { title: "Expenses", url: "/expenses", icon: ShoppingBasket },
  { title: "Store settings", url: "/store-settings", icon: Store },
];
