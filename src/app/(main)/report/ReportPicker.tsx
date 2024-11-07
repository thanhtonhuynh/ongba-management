"use client";

import {
  SearchReportInput,
  SearchReportSchema,
} from "@/lib/validations/report";
import { SaleReportCardProcessedData } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { searchReportAction } from "./actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { LoadingButton } from "@/components/buttons/LoadingButton";
import { ErrorMessage } from "@/components/Message";
import { SaleReportCard } from "@/components/SaleReportCard";

export function ReportPicker() {
  const [processedReport, setProcessedReport] =
    useState<SaleReportCardProcessedData | null>(null);
  const form = useForm<SearchReportInput>({
    resolver: zodResolver(SearchReportSchema),
    defaultValues: {
      date: new Date(),
    },
  });
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(data: SearchReportInput) {
    setError(null);
    setProcessedReport(null);

    startTransition(async () => {
      const { error, processedReport } = await searchReportAction(data);

      if (error) {
        setError(error);
        return;
      }
      setProcessedReport(processedReport);
    });
  }
  return (
    <div className={`space-y-4`}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 rounded-md border p-4 shadow"
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
                  Pick a date to search for a sales report
                </FormLabel>
                <FormControl>
                  <Calendar
                    className="mx-auto max-w-3xl"
                    mode="single"
                    selected={field.value}
                    onDayFocus={(date) => {
                      field.onChange(date);
                    }}
                    // onSelect={(date) => {
                    //   field.onChange(moment(date).toDate());
                    //   console.log(date);
                    // }}
                    onDayClick={(date) => {
                      field.onChange(date);
                    }}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
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

      {(error || processedReport) && (
        <div className="rounded-md border p-4 shadow">
          {error && <ErrorMessage message={error} />}

          {processedReport && (
            <div className="space-y-2">
              <h2>Sales Report</h2>

              <SaleReportCard data={processedReport} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
