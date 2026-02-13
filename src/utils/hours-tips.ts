import { getFirstReportDate } from "@/data-access/report";
import { BreakdownData, DayRange, Shift } from "@/types";
import { TZDate } from "@date-fns/tz";
import moment from "moment-timezone";
import { cache } from "react";

export const populateMonthSelectData = cache(async () => {
  const firstReportDate = await getFirstReportDate();

  if (!firstReportDate)
    return {
      years: [],
    };

  const today = moment().tz("America/Vancouver").startOf("day").toDate();

  const firstYear = firstReportDate.getFullYear();

  const years: number[] = [];
  let year = firstYear;
  while (year <= today.getFullYear()) {
    years.push(year);
    year++;
  }
  years.reverse();

  return {
    years,
  };
});

export function getTodayBiweeklyPeriod(): DayRange {
  const today = new TZDate(new Date(), "America/Vancouver").getDate();

  if (today <= 15) {
    return {
      start: moment().tz("America/Vancouver").date(1).startOf("day").toDate(),
      end: moment().tz("America/Vancouver").date(15).startOf("day").toDate(),
    };
  }

  return {
    start: moment().tz("America/Vancouver").date(16).startOf("day").toDate(),
    end: moment()
      .tz("America/Vancouver")
      .endOf("month")
      .startOf("day")
      .toDate(),
  };
}

export function getDayRangeByMonthAndYear(
  year: number,
  month: number,
): DayRange {
  return {
    start: moment()
      .tz("America/Vancouver")
      .year(year)
      .month(month)
      .date(1)
      .startOf("day")
      .toDate(),
    end: moment()
      .tz("America/Vancouver")
      .year(year)
      .month(month)
      .endOf("month")
      .startOf("day")
      .toDate(),
  };
}

export function getDayRangeByYear(year: number): DayRange {
  return {
    start: moment()
      .tz("America/Vancouver")
      .year(year)
      .startOf("year")
      .startOf("day")
      .toDate(),
    end: moment()
      .tz("America/Vancouver")
      .year(year)
      .endOf("year")
      .startOf("day")
      .toDate(),
  };
}

export function getPeriodsByMonthAndYear(
  year: number,
  month: number,
): DayRange[] {
  const periods: DayRange[] = [];

  periods.push({
    start: moment()
      .tz("America/Vancouver")
      .year(year)
      .month(month)
      .date(1)
      .startOf("day")
      .toDate(),
    end: moment()
      .tz("America/Vancouver")
      .year(year)
      .month(month)
      .date(15)
      .startOf("day")
      .toDate(),
  });

  periods.push({
    start: moment()
      .tz("America/Vancouver")
      .year(year)
      .month(month)
      .date(16)
      .startOf("day")
      .toDate(),
    end: moment()
      .tz("America/Vancouver")
      .year(year)
      .month(month)
      .endOf("month")
      .startOf("day")
      .toDate(),
  });

  return periods;
}

export function getHoursTipsBreakdownInDayRange(
  dayRange: DayRange,
  shifts: Shift[],
) {
  const hoursMap = new Map<string, BreakdownData>();
  const tipsMap = new Map<string, BreakdownData>();

  // Compute number of days
  const msPerDay = 24 * 60 * 60 * 1000;
  const start = dayRange.start;
  const end = dayRange.end;
  const numDays = Math.floor((end.getTime() - start.getTime()) / msPerDay) + 1;

  const makeEmptyRow = (shift: Shift): BreakdownData => ({
    userId: shift.userId,
    userName: shift.userName,
    userUsername: shift.userUsername,
    image: shift.userImage,
    keyData: Array(numDays).fill(0),
    total: 0,
  });

  for (const shift of shifts) {
    // Compute the index by true day difference, not day-of-month
    const index = Math.floor(
      (shift.date.getTime() - start.getTime()) / msPerDay,
    );

    // If for some reason the shift is out of range, skip it
    if (index < 0 || index >= numDays) continue;

    // HOURS
    let hoursRow = hoursMap.get(shift.userId);
    if (!hoursRow) {
      hoursRow = makeEmptyRow(shift);
      hoursMap.set(shift.userId, hoursRow);
    }
    hoursRow.keyData[index] = shift.hours;
    hoursRow.total += shift.hours;

    // TIPS
    let tipsRow = tipsMap.get(shift.userId);
    if (!tipsRow) {
      tipsRow = makeEmptyRow(shift);
      tipsMap.set(shift.userId, tipsRow);
    }
    tipsRow.keyData[index] = shift.tips;
    tipsRow.total += shift.tips;
  }

  const sortByName = (a: BreakdownData, b: BreakdownData) =>
    a.userName.localeCompare(b.userName);

  return {
    hoursBreakdown: Array.from(hoursMap.values()).sort(sortByName),
    tipsBreakdown: Array.from(tipsMap.values()).sort(sortByName),
  };
}
