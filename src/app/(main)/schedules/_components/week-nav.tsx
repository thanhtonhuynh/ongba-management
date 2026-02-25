"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ICONS } from "@/constants/icons";
import { cn } from "@/lib/utils";
import { ChevronRight, Left, Right } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { addDays } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toUTCDateKey } from "../_lib/types";

type WeekNavProps = {
  weekStart: string; // ISO
  prevWeekStart: string; // ISO
  nextWeekStart: string; // ISO
  isDirty: boolean;
  onBeforeNavigate: () => boolean;
};

export function WeekNav({
  weekStart,
  prevWeekStart,
  nextWeekStart,
  isDirty,
  onBeforeNavigate,
}: WeekNavProps) {
  const router = useRouter();
  const [calendarOpen, setCalendarOpen] = useState(false);

  const weekStartDate = new Date(weekStart);
  const weekEndDate = addDays(weekStartDate, 6);

  const prevParam = toUTCDateKey(prevWeekStart);
  const nextParam = toUTCDateKey(nextWeekStart);

  const [month, setMonth] = useState(new Date(weekStartDate));

  function formatUTCDate(d: Date, opts: Intl.DateTimeFormatOptions): string {
    return new Intl.DateTimeFormat("en-US", { ...opts, timeZone: "UTC" }).format(d);
  }

  function handleNavClick(e: React.MouseEvent, href: string) {
    if (isDirty && !onBeforeNavigate()) {
      e.preventDefault();
    }
  }

  function handleCalendarSelect(date: Date | undefined) {
    if (!date) return;
    // Compute Monday of the selected week (all in local time from calendar, convert to UTC key)
    const day = date.getDay(); // 0=Sun..6=Sat
    const mondayOffset = day === 0 ? -6 : 1 - day;
    const monday = new Date(date);
    monday.setDate(monday.getDate() + mondayOffset);
    const key =
      monday.getFullYear().toString() +
      "-" +
      (monday.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      monday.getDate().toString().padStart(2, "0");

    if (isDirty && !onBeforeNavigate()) return;
    setCalendarOpen(false);
    router.push(`/schedules?week=${key}`);
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Link
          href={`/schedules?week=${prevParam}`}
          onClick={(e) => handleNavClick(e, `/schedules?week=${prevParam}`)}
          className={cn(buttonVariants({ variant: "outline", size: "icon-xs" }))}
        >
          <HugeiconsIcon icon={Left} />
          <span className="sr-only">Previous</span>
        </Link>

        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger
            render={
              <Button variant="accent" size="sm" className="group min-w-[180px]">
                <span>{formatUTCDate(weekStartDate, { month: "short", day: "numeric" })}</span>
                <HugeiconsIcon icon={ChevronRight} />
                <span>
                  {formatUTCDate(weekEndDate, { month: "short", day: "numeric", year: "numeric" })}
                </span>
                <HugeiconsIcon
                  icon={ICONS.ARROW_DOWN}
                  className="text-muted-foreground group-hover:text-foreground ml-1 transition-colors"
                />
              </Button>
            }
          />
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              mode="single"
              selected={weekStartDate}
              onSelect={handleCalendarSelect}
              defaultMonth={weekStartDate}
              month={month}
              onMonthChange={setMonth}
              captionLayout="dropdown"
              startMonth={new Date(2024, 9)}
            />
          </PopoverContent>
        </Popover>

        <Link
          href={`/schedules?week=${nextParam}`}
          onClick={(e) => handleNavClick(e, `/schedules?week=${nextParam}`)}
          className={cn(buttonVariants({ variant: "outline", size: "icon-xs" }))}
        >
          <span className="sr-only">Next</span>
          <HugeiconsIcon icon={Right} />
        </Link>
      </div>
    </div>
  );
}
