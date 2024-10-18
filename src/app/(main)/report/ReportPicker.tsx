"use client";

import { SearchReportInput, SearchReportSchema } from "@/lib/report/validation";
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
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import moment from "moment";
import { Calendar } from "@/components/ui/calendar";
import { LoadingButton } from "@/components/LoadingButton";
import { CalendarIcon } from "@radix-ui/react-icons";
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
    console.log(data);
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
    <div className="flex">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  {/* <Button
                    type="button"
                    variant={"outline"}
                    className={cn(
                      "w-[240px] pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground",
                    )}
                  >
                    {field.value ? (
                      moment(field.value).format("MMM D, YYYY")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button> */}
                </FormControl>
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <LoadingButton loading={isPending} type="submit">
            {isPending ? "Searching..." : "Search"}
          </LoadingButton>
        </form>
      </Form>

      <div className="flex-1">
        {error && <ErrorMessage message={error} />}

        {processedReport && (
          <div>
            <h2>
              Sales Report for{" "}
              {moment(processedReport.date).format("MMM D, YYYY")}
            </h2>

            <SaleReportCard data={processedReport} />
          </div>
        )}
      </div>
    </div>
  );
}
