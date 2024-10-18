"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FULL_MONTHS, NUM_MONTHS } from "@/app/constants";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type PeriodSelectProps = {
  years: number[];
  firstYearMonths: number[];
  latestYearMonths: number[];
};

export function PeriodSelect({
  years,
  firstYearMonths,
  latestYearMonths,
}: PeriodSelectProps) {
  const pathname = usePathname();
  const [selectedYear, setSelectedYear] = useState<number>(years[0]);
  const [displayedMonths, setDisplayedMonths] =
    useState<number[]>(latestYearMonths);

  function handleYearChange(year: number) {
    if (year === years[years.length - 1]) {
      setDisplayedMonths(firstYearMonths);
    } else if (year === years[0]) {
      setDisplayedMonths(latestYearMonths);
    } else {
      setDisplayedMonths(NUM_MONTHS);
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
              href={`/admin/hours&tips/${selectedYear}/${month + 1}`}
              className={cn(
                pathname === `/admin/hours&tips/${selectedYear}/${month + 1}` &&
                  "bg-muted hover:no-underline",
              )}
            >
              {FULL_MONTHS[month]}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
