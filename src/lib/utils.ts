import { clsx, type ClassValue } from "clsx";
import moment from "moment-timezone";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-US", {
    // style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * @deprecated Use formatMoney instead.
 */
export function formatPriceWithDollar(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(number: number) {
  return new Intl.NumberFormat("en-US").format(number);
}

export function isISOString(value: string) {
  const date = new Date(value);
  return !Number.isNaN(date.valueOf()) && date.toISOString() === value;
}

export function toCents(value: number | null | undefined): number {
  if (!value) return 0;
  // half-up rounding
  return Math.floor(value * 100 + 0.5);
}

export function parseVancouverUrlDate(dateStr?: string): Date | null {
  if (!dateStr) return null;

  // Expecting "YYYY-MM-DD"
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;

  // Interpret the string as a Vancouver date at midnight
  const m = moment.tz(dateStr, "YYYY-MM-DD", "America/Vancouver");
  if (!m.isValid()) return null;

  return m.toDate();
}

/**
 * Format a Date object into a "YYYY-MM-DD" string in the America/Vancouver timezone.
 */
export function formatVancouverDate(date: Date): string {
  return moment.tz(date, "America/Vancouver").format("YYYY-MM-DD");
}
