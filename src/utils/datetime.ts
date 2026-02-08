import { startOfDay } from "date-fns";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";

const timeZone = "America/Vancouver";

/**
 * Formats a date to "yyyy-MM-dd" in the Vancouver timezone.
 */
export function formatVancouverDate(
  date: Date,
  formatStr: string = "yyyy-MM-dd",
): string {
  return formatInTimeZone(date, timeZone, formatStr);
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
