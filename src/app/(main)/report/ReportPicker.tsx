"use client";

import { LoadingButton } from "@/components/buttons/LoadingButton";
import { ErrorMessage } from "@/components/Message";
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
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { findReportByDateAction } from "./actions";

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
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   if (initialDate) {
  //     form.reset({ date: initialDate });
  //   }
  // }, [initialDate, form]);

  async function onSubmit(data: SearchReportInput) {
    setError(null);

    startTransition(async () => {
      const { error, reportId } = await findReportByDateAction(data);

      if (error || !reportId) {
        toast.error(error || "Report not found.");
        // router.push(`/report`);
        return;
      }
      // router.push(`/report/${reportId}`);

      router.push(`/report/${formatVancouverDate(data.date)}`);
    });
  }
  return (
    <div className="flex flex-col gap-8">
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

      {error && <ErrorMessage message={error} />}
    </div>
  );
}
