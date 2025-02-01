"use client";

import { FULL_MONTHS, NUM_MONTHS } from "@/app/constants";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

type MonthSelectProps = {
  years: number[];
  selectedYear: number;
  selectedMonth: number;
};

export function MonthSelect({
  years,
  selectedYear,
  selectedMonth,
}: MonthSelectProps) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <Select
        value={selectedYear.toString()}
        onValueChange={(value) => {
          router.push(`/admin/cashflow?year=${value}`);
        }}
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

      <div className="flex flex-col items-start gap-1">
        {NUM_MONTHS.map((month) => (
          <Button
            key={month}
            variant={`link`}
            className={cn(
              "h-fit p-0",
              month - 1 === selectedMonth && "bg-muted hover:no-underline",
            )}
            disabled={month - 1 === selectedMonth}
          >
            <Link
              className="px-4 py-2"
              href={`/admin/cashflow?year=${selectedYear}&month=${month}`}
            >
              {FULL_MONTHS[month - 1]}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
