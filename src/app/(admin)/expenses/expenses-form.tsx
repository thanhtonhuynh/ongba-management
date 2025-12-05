"use client";

import { LoadingButton } from "@/components/buttons/LoadingButton";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { InputField } from "@/components/ui/form/input-field";
import { cn } from "@/lib/utils";
import {
  ExpensesFormInput,
  ExpensesFormSchema,
} from "@/lib/validations/expenses";
import { zodResolver } from "@hookform/resolvers/zod";
import { Expense } from "@prisma/client";
import { Trash } from "lucide-react";
import { useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { addExpensesAction, updateExpensesAction } from "./actions";

type Props = {
  expense?: Expense;
};

export function ExpensesForm({ expense }: Props) {
  const form = useForm<ExpensesFormInput>({
    mode: "onChange",
    resolver: zodResolver(ExpensesFormSchema),
    defaultValues: {
      date: expense ? new Date(expense.date) : new Date(),
      entries: expense
        ? expense.entries.map((entry) => ({
            ...entry,
            amount: entry.amount / 100,
          }))
        : [{ amount: 0, reason: "" }],
    },
  });
  const entries = useFieldArray({ control: form.control, name: "entries" });
  const [isPending, startTransition] = useTransition();
  const { isDirty, isValid } = form.formState;

  async function onSubmit(data: ExpensesFormInput) {
    startTransition(async () => {
      const error = expense
        ? await updateExpensesAction(data, expense.id)
        : await addExpensesAction(data);

      if (error) toast.error(error);
      else {
        toast.success("Expenses saved");

        if (expense) form.reset(data);
        else {
          form.reset({ entries: [{ amount: 0, reason: "" }], date: data.date });
        }
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2"
      >
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Calendar
                  className=""
                  mode="single"
                  defaultMonth={field.value}
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
                  initialFocus
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {entries.fields.map((entry, index) => (
          <div key={entry.id} className="flex items-start gap-2">
            <InputField
              nameInSchema={`entries.${index}.amount`}
              fieldTitle={index === 0 ? "Amount" : ""}
              type="number"
              inputClassName="w-24"
            />
            <InputField
              nameInSchema={`entries.${index}.reason`}
              fieldTitle={index === 0 ? "Reason" : ""}
              formItemClassName="flex-1"
            />
            <Button
              variant={"ghost"}
              size={"icon"}
              type="button"
              onClick={() => {
                entries.remove(index);
              }}
              className={cn("hover:text-destructive", index === 0 && "mt-6")}
            >
              <Trash className="size-4" />
            </Button>
          </div>
        ))}

        <FormMessage>
          {form.getFieldState("entries").error?.message}
        </FormMessage>

        <div className="mt-4 flex justify-center gap-4">
          <Button
            variant={"outline"}
            type="button"
            onClick={() => {
              entries.append({ amount: 0, reason: "" });
            }}
            className="h-10"
          >
            Add another entry
          </Button>

          <LoadingButton
            loading={isPending}
            type="submit"
            className="h-10"
            disabled={!isDirty || !isValid}
          >
            {isPending ? "Saving..." : "Save"}
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
}
