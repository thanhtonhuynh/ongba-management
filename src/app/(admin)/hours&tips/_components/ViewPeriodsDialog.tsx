"use client";

import { FULL_MONTHS, NUM_MONTHS } from "@/app/constants";
import { LoadingButton } from "@/components/buttons/LoadingButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ViewPastPeriodsInput,
  ViewPastPeriodsSchema,
} from "@/lib/validations/hours&tips";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";

type ViewPeriodsDialogProps = {
  years: number[];
};

export function ViewPeriodsDialog({ years }: ViewPeriodsDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const form = useForm<ViewPastPeriodsInput>({
    resolver: zodResolver(ViewPastPeriodsSchema),
    defaultValues: {
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
    },
  });
  const [isPending, startTransition] = useTransition();

  function onSubmit(data: ViewPastPeriodsInput) {
    startTransition(() => {
      router.push(`/hours&tips/${data.year}/${data.month + 1}`);
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size={`sm`} variant={"outline"} className="tracking-normal">
            <HugeiconsIcon icon={Clock} />
            View past periods
          </Button>
        }
      />

      <DialogContent>
        <DialogHeader className="space-y-3 text-left">
          <DialogTitle>View past periods</DialogTitle>

          <DialogDescription>
            Select a year and month to view the hours and tips for the two
            biweekly periods in that month.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value.toString()}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a year" />
                      </SelectTrigger>

                      <SelectContent className="max-h-56">
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <FieldGroup>
              <Controller
                name="year"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    orientation="responsive"
                    data-invalid={fieldState.invalid}
                  >
                    <FieldLabel htmlFor="form-rhf-select-language">
                      Year
                    </FieldLabel>
                    <Select
                      name={field.name}
                      value={field.value.toString()}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        aria-invalid={fieldState.invalid}
                        className="min-w-30"
                      >
                        <SelectValue placeholder="Select a year" />
                      </SelectTrigger>

                      <SelectContent alignItemWithTrigger={false}>
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            {/* <FormField
              control={form.control}
              name="month"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Month</FormLabel>
                  <Select
                    value={field.value.toString()}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a month" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent className="max-h-56">
                      {NUM_MONTHS.map((month) => (
                        <SelectItem key={month} value={(month - 1).toString()}>
                          {FULL_MONTHS[month - 1]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <FieldGroup>
              <Controller
                name="month"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    orientation="responsive"
                    data-invalid={fieldState.invalid}
                  >
                    <FieldLabel htmlFor="form-rhf-select-language">
                      Month
                    </FieldLabel>
                    <Select
                      name={field.name}
                      value={field.value.toString()}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        aria-invalid={fieldState.invalid}
                        className="min-w-30"
                      >
                        <SelectValue placeholder="Select a month">
                          {FULL_MONTHS[field.value]}
                        </SelectValue>
                      </SelectTrigger>

                      <SelectContent alignItemWithTrigger={false}>
                        {NUM_MONTHS.map((month) => (
                          <SelectItem
                            key={month}
                            value={(month - 1).toString()}
                          >
                            {FULL_MONTHS[month - 1]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <DialogFooter className="gap-2 sm:space-x-0">
              <DialogClose
                render={
                  <Button variant={`ghost`} type="button">
                    Cancel
                  </Button>
                }
              />

              <LoadingButton loading={isPending} type="submit">
                Done
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
