import { DayRange } from "@/types";
import { getFirstReportDate } from "@/data/report";
import { cache } from "react";

// export const populateBiweeklyPeriods = cache(async () => {
//   const firstReportDate = new Date("2023-08-15T00:00:00.000+00:00");

//   if (!firstReportDate) return [];

//   const today = new Date();

//   const biweeklyPeriods = [];

//   let startDate = new Date(firstReportDate);

//   while (startDate < today) {
//     if (startDate.getDate() < 15) {
//       biweeklyPeriods.push({
//         start: new Date(startDate),
//         end: new Date(startDate.getFullYear(), startDate.getMonth(), 14),
//       });

//       startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 15);
//     } else {
//       biweeklyPeriods.push({
//         start: new Date(startDate),
//         end: new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0),
//       });

//       startDate = new Date(
//         startDate.getFullYear(),
//         startDate.getMonth() + 1,
//         1,
//       );
//     }
//   }

//   return biweeklyPeriods;
// });

export const populatePeriodSelectData = cache(async () => {
  const firstReportDate = await getFirstReportDate();

  if (!firstReportDate)
    return {
      years: [],
      firstYearMonths: [],
      latestYearMonths: [],
    };

  const today = new Date();
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
  for (let i = 0; i <= today.getMonth(); i++) {
    latestYearMonths.push(i);
  }

  return {
    years,
    firstYearMonths,
    latestYearMonths,
  };
});

export function getTodayBiweeklyPeriod(): DayRange {
  const today = new Date();
  const day = today.getDate();

  if (day < 15) {
    return {
      start: new Date(today.getFullYear(), today.getMonth(), 1),
      end: new Date(today.getFullYear(), today.getMonth(), 14),
    };
  }

  return {
    start: new Date(today.getFullYear(), today.getMonth(), 15),
    end: new Date(today.getFullYear(), today.getMonth() + 1, 0),
  };
}

export function getPeriodsByMonthAndYear(
  year: number,
  month: number,
): DayRange[] {
  const periods: DayRange[] = [];

  periods.push({
    start: new Date(year, month - 1, 1),
    end: new Date(year, month - 1, 14),
  });

  periods.push({
    start: new Date(year, month - 1, 15),
    end: new Date(year, month, 0),
  });

  return periods;
}
