import { BreakdownData, DayRange, EmployeeShift } from "@/types";
import { getFirstReportDate } from "@/data-access/report";
import { cache } from "react";
import moment from "moment-timezone";

export const populateMonthSelectData = cache(async () => {
  const firstReportDate = await getFirstReportDate();

  if (!firstReportDate)
    return {
      years: [],
      firstYearMonths: [],
      latestYearMonths: [],
    };

  const today = moment().tz("America/Vancouver").startOf("day").toDate();

  const firstYear = firstReportDate.getFullYear();
  const firstMonth = firstReportDate.getMonth();

  const years: number[] = [];
  let year = firstYear;
  while (year <= today.getFullYear()) {
    years.push(year);
    year++;
  }
  years.reverse();

  const firstYearMonths: number[] = [];
  for (let i = firstMonth; i < 12; i++) {
    firstYearMonths.push(i);
  }

  const latestYearMonths: number[] = [];
  if (firstYear === today.getFullYear()) {
    for (let i = firstMonth; i <= today.getMonth(); i++) {
      latestYearMonths.push(i);
    }
  } else {
    for (let i = 0; i <= today.getMonth(); i++) {
      latestYearMonths.push(i);
    }
  }

  return {
    years,
    firstYearMonths,
    latestYearMonths,
  };
});

export function getTodayBiweeklyPeriod(): DayRange {
  const today = moment().tz("America/Vancouver").toDate();
  const day = today.getDate();

  if (day <= 15) {
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
      .year(year)
      .month(month)
      .tz("America/Vancouver")
      .date(1)
      .startOf("day")
      .toDate(),
    end: moment()
      .year(year)
      .month(month)
      .tz("America/Vancouver")
      .endOf("month")
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
      .year(year)
      .month(month)
      .tz("America/Vancouver")
      .date(1)
      .startOf("day")
      .toDate(),
    end: moment()
      .year(year)
      .month(month)
      .tz("America/Vancouver")
      .date(15)
      .startOf("day")
      .toDate(),
  });

  periods.push({
    start: moment()
      .year(year)
      .month(month)
      .tz("America/Vancouver")
      .date(16)
      .startOf("day")
      .toDate(),
    end: moment()
      .year(year)
      .month(month)
      .tz("America/Vancouver")
      .endOf("month")
      .startOf("day")
      .toDate(),
  });

  return periods;
}

export function getHoursTipsBreakdownInDayRange(
  dayRange: DayRange,
  employeeShifts: EmployeeShift[],
) {
  const hoursBreakdown: BreakdownData[] = [];
  const tipsBreakdown: BreakdownData[] = [];

  const startDay = dayRange.start.getDate();
  const endDay = dayRange.end.getDate();

  // Initialize the breakdown data with the employees, the keyData array (initialize to 0s), and the total hours and tips
  for (const shift of employeeShifts) {
    const index = hoursBreakdown.findIndex(
      (data) => data.userId === shift.userId,
    );

    if (index === -1) {
      hoursBreakdown.push({
        userId: shift.userId,
        userName: shift.user.name,
        image: shift.user.image || "",
        keyData: Array(endDay - startDay + 1).fill(0),
        total: 0,
      });

      tipsBreakdown.push({
        userId: shift.userId,
        userName: shift.user.name,
        image: shift.user.image || "",
        keyData: Array(endDay - startDay + 1).fill(0),
        total: 0,
      });
    }
  }

  // Process the employee shifts
  for (const shift of employeeShifts) {
    const index = hoursBreakdown.findIndex(
      (data) => data.userId === shift.userId,
    );

    const day = shift.date.getDate();
    const hours = shift.hours;
    const tips = shift.tips;

    hoursBreakdown[index].keyData[day - startDay] = hours;
    hoursBreakdown[index].total += hours;

    tipsBreakdown[index].keyData[day - startDay] = tips;
    tipsBreakdown[index].total += tips;
  }

  return {
    hoursBreakdown: hoursBreakdown.sort((a, b) =>
      a.userName.localeCompare(b.userName),
    ),
    tipsBreakdown: tipsBreakdown.sort((a, b) =>
      a.userName.localeCompare(b.userName),
    ),
  };
}
