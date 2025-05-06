"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useState } from "react";

const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const FULL_MONTHS = [
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

type PeriodSelectProps = {
  years: number[];
  firstYearMonths: number[];
  lastYearMonths: number[];
};

export function PeriodSelect({
  years,
  firstYearMonths,
  lastYearMonths,
}: PeriodSelectProps) {
  const [selectedYear, setSelectedYear] = useState<number>(years[0]);
  const [displayedMonths, setDisplayedMonths] =
    useState<number[]>(lastYearMonths);

  function handleYearChange(year: number) {
    if (year === years[years.length - 1]) {
      setDisplayedMonths(firstYearMonths);
    } else if (year === years[0]) {
      setDisplayedMonths(lastYearMonths);
    } else {
      setDisplayedMonths(months);
    }

    setSelectedYear(year);
  }

  return (
    <div className="space-y-4">
      <Select
        value={selectedYear.toString()}
        onValueChange={(value) => handleYearChange(parseInt(value))}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex flex-col items-start">
        {displayedMonths.map((month) => (
          <Button key={month} asChild variant={`link`}>
            <Link
              href={`/hours&tips/${selectedYear}/${FULL_MONTHS[month].toLowerCase()}`}
            >
              {FULL_MONTHS[month]}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
