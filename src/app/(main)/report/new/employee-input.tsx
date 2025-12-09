"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User } from "@/lib/auth/session";
import { SaleReportInputs } from "@/lib/validations/report";
import { Plus, X } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { EmployeeCombobox } from "./employee-combobox";

type Props = {
  users: User[];
};

export function EmployeeInput({ users }: Props) {
  const form = useFormContext<SaleReportInputs>();
  const employees = useFieldArray({
    control: form.control,
    name: "employees",
  });

  const selectedUserIds = form
    .watch("employees")
    .map((e) => e.userId)
    .filter(Boolean);

  function handleSelectUser(index: number, user: User) {
    const currentItem = form.getValues(`employees.${index}`);

    employees.update(index, {
      ...currentItem,
      userId: user.id,
      name: user.name,
      image: user.image || undefined,
    });
  }
  return (
    <div className="mt-4 space-y-2">
      <h6 className="mb-2 text-sm font-medium">Employees</h6>

      {employees.fields.map((field, index) => (
        <div key={field.id} className="flex items-start gap-3">
          <FormField
            control={form.control}
            name={`employees.${index}.userId` as const}
            render={({ field: userField }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <EmployeeCombobox
                    users={users}
                    selectedUserId={userField.value}
                    selectedUserIds={selectedUserIds}
                    onSelect={(user) => handleSelectUser(index, user)}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`employees.${index}.hour`}
            render={({ field: hourField }) => (
              <FormItem className="w-28 space-y-1">
                <FormControl>
                  <Input
                    type="number"
                    step="0.25"
                    {...hourField}
                    onChange={(e) =>
                      hourField.onChange(
                        e.target.value === "" ? "" : Number(e.target.value),
                      )
                    }
                    onFocus={(e) => e.target.select()}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            variant="ghost"
            type="button"
            size={"icon"}
            className="text-muted-foreground hover:text-destructive"
            onClick={() => employees.remove(index)}
          >
            <X className="size-4" />
          </Button>
        </div>
      ))}

      <FormMessage>{form.formState.errors.employees?.message}</FormMessage>

      <Button
        variant={"outline"}
        type="button"
        className="mt-2"
        size={"sm"}
        onClick={() => employees.append({ userId: "", hour: 0, name: "" })}
      >
        <Plus className="size-3" />
        Add an employee
      </Button>
    </div>
  );
}
