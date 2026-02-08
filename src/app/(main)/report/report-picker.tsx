"use client";

import { LoadingButton } from "@/components/buttons/LoadingButton";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { formatVancouverDate, parseVancouverUrlDate } from "@/lib/utils";
import {
  SearchReportInput,
  SearchReportSchema,
} from "@/lib/validations/report";
import { getTodayStartOfDay } from "@/utils/datetime";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";

export function ReportPicker() {
  const { date } = useParams<{ date?: string }>();
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);

  const today = getTodayStartOfDay();
  const dateFromParams = parseVancouverUrlDate(date);
  const initialDate = dateFromParams ?? today;

  const form = useForm<SearchReportInput>({
    resolver: zodResolver(SearchReportSchema),
    defaultValues: {
      date: initialDate,
    },
  });
  const [isPending, startTransition] = useTransition();
  const [month, setMonth] = useState<Date>(
    new Date(initialDate.getFullYear(), initialDate.getMonth()),
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    form.reset({ date: initialDate });
    setMonth(new Date(initialDate.getFullYear(), initialDate.getMonth()));
  }, [date]);

  async function onSubmit(data: SearchReportInput) {
    startTransition(() => {
      router.push(`/report/${formatVancouverDate(data.date)}`);
    });
  }

  // Prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="space-y-4">
        <h6 className="font-semibold">
          Pick a date to search for a sale report
        </h6>
        <div className="mx-auto w-full max-w-xl space-y-4">
          <div className="bg-muted h-75 w-full animate-pulse rounded-lg border" />
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            form.handleSubmit(onSubmit)();
          }
        }}
      >
        <h6 className="text-sm font-semibold">
          Select a date to view a sales report
        </h6>

        <div className="mx-auto w-full max-w-sm space-y-3">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    onDayClick={field.onChange}
                    month={month}
                    onMonthChange={setMonth}
                    startMonth={new Date(2024, 9)}
                    disabled={{ after: today }}
                    captionLayout="dropdown"
                    className="w-full rounded-lg border shadow-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            variant="link"
            size={"sm"}
            onClick={() => {
              form.setValue("date", today);
              setMonth(new Date(today.getFullYear(), today.getMonth()));
            }}
            className="p-0"
          >
            View Today
          </Button>

          <LoadingButton loading={isPending} type="submit" className="w-full">
            {isPending ? "Searching..." : "Search"}
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
}
