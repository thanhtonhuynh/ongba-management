import { utc } from "@date-fns/utc";
import { endOfWeek, startOfDay, startOfWeek } from "date-fns";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";

const timeZone = "America/Vancouver";

/**
 * Formats a date to "yyyy-MM-dd" in the Vancouver timezone.
 */
export function formatVancouverDate(date: Date, formatStr: string = "yyyy-MM-dd"): string {
  return formatInTimeZone(date, timeZone, formatStr);
}

/**
 * Formats a date in UTC timezone.
 */
export function formatUTCDate(date: Date, formatStr: string = "yyyy-MM-dd"): string {
  return formatInTimeZone(date, "UTC", formatStr);
}

/**
 * Get start of year date in Vancouver timezone
 */
export function getStartOfYear(year: number): Date {
  return fromZonedTime(`${year}-01-01T00:00:00`, timeZone);
}

/**
 * Get end of year date in Vancouver timezone
 */
export function getEndOfYear(year: number): Date {
  return fromZonedTime(`${year}-12-31T23:59:59.999`, timeZone);
}

/**
 * Get today's start of day in Vancouver timezone
 */
export function getTodayStartOfDay(): Date {
  return fromZonedTime(startOfDay(Date.now()), timeZone);
}

/**
 * Get current year in Vancouver timezone
 */
export function getCurrentYear(): number {
  return fromZonedTime(new Date(), timeZone).getFullYear();
}

/**
 * Get start of week (Monday 00:00) of the week containing the given date, in UTC.
 * The date is interpreted as a calendar date (YYYY-MM-DD), so week math is done in UTC
 * to avoid timezone shifting the day (e.g. 2026-02-16 stays Feb 16, not previous day).
 */
export function getStartOfWeekUTC(date: Date | string): Date {
  // const d =
  //   typeof date === "string"
  //     ? new Date(date.includes("T") ? date : `${date}T00:00:00.000Z`)
  //     : new Date(date);
  // const y = d.getUTCFullYear();
  // const m = d.getUTCMonth();
  // const day = d.getUTCDate();
  // const utcDate = new Date(Date.UTC(y, m, day));
  // const weekday = utcDate.getUTCDay(); // 0 = Sun, 1 = Mon, ...
  // const daysToMonday = weekday === 0 ? 6 : weekday - 1;
  // utcDate.setUTCDate(utcDate.getUTCDate() - daysToMonday);
  // return utcDate;

  return startOfWeek(date, { weekStartsOn: 1, in: utc });
}

/**
 * Get end of week (Sunday 23:59:59.999) of the week containing the given date, in UTC.
 */
export function getEndOfWeekUTC(date: Date | string): Date {
  // const start = getStartOfWeekUTC(date);
  // const end = new Date(start);
  // end.setUTCDate(end.getUTCDate() + 6);
  // end.setUTCHours(23, 59, 59, 999);
  // return end;

  return endOfWeek(date, { weekStartsOn: 1, in: utc });
}
