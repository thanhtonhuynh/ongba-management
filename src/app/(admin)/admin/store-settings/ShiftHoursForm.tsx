"use client";

import {
  UpdateShiftHoursInput,
  UpdateShiftHoursSchema,
} from "@/lib/validations/store";
import { ShiftHours, Weekday } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { updateShiftHours } from "./actions";
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
import { LoadingButton } from "@/components/LoadingButton";

type ShiftHoursFormProps = {
  currentShiftHours: ShiftHours;
};

export function ShiftHoursForm({ currentShiftHours }: ShiftHoursFormProps) {
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();
  const form = useForm<UpdateShiftHoursInput>({
    resolver: zodResolver(UpdateShiftHoursSchema),
    mode: "onBlur",
    defaultValues: {
      monday: currentShiftHours.monday,
      tuesday: currentShiftHours.tuesday,
      wednesday: currentShiftHours.wednesday,
      thursday: currentShiftHours.thursday,
      friday: currentShiftHours.friday,
      saturday: currentShiftHours.saturday,
      sunday: currentShiftHours.sunday,
    },
  });

  async function onSubmit(data: UpdateShiftHoursInput) {
    startTransition(async () => {
      const { error } = await updateShiftHours(data);

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
      <h2 className="font-semibold">Work hours</h2>

      <div className="space-y-1 text-sm text-muted-foreground">
        <p>
          Update the working hours for each day. The hours are in 24-hour
          format.
        </p>
        <p>
          <span className="font-semibold">Note:</span> Any changes to the
          working hours will be applied to the hours of the employees on the
          next sales report. The past reports will not be affected.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          {error && <ErrorMessage message={error} />}
          {success && <SuccessMessage message="Shift hours updated" />}

          {Object.keys(currentShiftHours).map((key) => (
            <FormField
              key={key}
              name={key as Weekday}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <LoadingButton loading={isPending} type="submit">
            Update shift hours
          </LoadingButton>
        </form>
      </Form>
    </div>
  );
}
