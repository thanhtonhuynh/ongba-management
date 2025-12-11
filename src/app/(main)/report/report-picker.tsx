"use client";

import { LoadingButton } from "@/components/buttons/LoadingButton";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { formatVancouverDate, parseVancouverUrlDate } from "@/lib/utils";
import {
  SearchReportInput,
  SearchReportSchema,
} from "@/lib/validations/report";
import { zodResolver } from "@hookform/resolvers/zod";
import moment from "moment-timezone";
import { useParams, useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

export function ReportPicker() {
  const { date } = useParams<{ date?: string }>();
  const router = useRouter();

  const today = moment().tz("America/Vancouver").startOf("day").toDate();
  const dateFromParams = parseVancouverUrlDate(date);
  const initialDate = dateFromParams ?? today;

  const form = useForm<SearchReportInput>({
    resolver: zodResolver(SearchReportSchema),
    defaultValues: {
      date: initialDate,
    },
  });
  const [isPending, startTransition] = useTransition();

  async function onSubmit(data: SearchReportInput) {
    startTransition(() => {
      router.push(`/report/${formatVancouverDate(data.date)}`);
    });
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 rounded-lg border p-6 shadow-sm"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            form.handleSubmit(onSubmit)();
          }
        }}
      >
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                Pick a date to search for a sale report
              </FormLabel>
              <FormControl>
                <Calendar
                  className="mx-auto max-w-3xl"
                  mode="single"
                  selected={field.value}
                  onDayFocus={(date) => {
                    field.onChange(date);
                  }}
                  onDayClick={(date) => {
                    field.onChange(date);
                  }}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <LoadingButton loading={isPending} type="submit" className="w-full">
          {isPending ? "Searching..." : "Search"}
        </LoadingButton>
      </form>
    </Form>
  );
}
