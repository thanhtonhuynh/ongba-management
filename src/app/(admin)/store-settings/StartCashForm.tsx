"use client";

import {
  UpdateStartCashInput,
  UpdateStartCashSchema,
} from "@/lib/validations/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { updateStartCash } from "./actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ErrorMessage, SuccessMessage } from "@/components/Message";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/buttons/LoadingButton";

type ShiftHoursFormProps = {
  currentStartCash: number;
};

export function StartCashForm({ currentStartCash }: ShiftHoursFormProps) {
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();
  const form = useForm<UpdateStartCashInput>({
    resolver: zodResolver(UpdateStartCashSchema),
    mode: "onBlur",
    defaultValues: {
      startCash: currentStartCash,
    },
  });

  async function onSubmit(data: UpdateStartCashInput) {
    startTransition(async () => {
      const { error } = await updateStartCash(data);

      if (error) {
        setError(error);
      } else {
        setSuccess(true);

        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      }
    });
  }

  return (
    <div className="space-y-2 rounded-md border p-4 shadow-md">
      <h2>Start cash</h2>

      <div className="space-y-1 text-sm text-muted-foreground">
        <p>Update the start cash amount.</p>
        <p>
          <span className="font-semibold">Note:</span> Any changes to the start
          cash amount will be applied to the next sales report. The past reports
          will not be affected.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          {error && <ErrorMessage message={error} />}
          {success && <SuccessMessage message="Start cash updated" />}

          <FormField
            name={"startCash"}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start cash</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <LoadingButton loading={isPending} type="submit">
            Update start cash
          </LoadingButton>
        </form>
      </Form>
    </div>
  );
}
