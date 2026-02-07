"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

type Props = {
  years: number[];
  selectedYear: number;
};

export function YearSelector({ years, selectedYear }: Props) {
  const router = useRouter();

  return (
    <Select
      value={selectedYear.toString()}
      onValueChange={(value) => {
        router.push(`/expenses?year=${value}`);
      }}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>

      <SelectContent alignItemWithTrigger={false}>
        {years.map((year) => (
          <SelectItem key={year} value={year.toString()}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
