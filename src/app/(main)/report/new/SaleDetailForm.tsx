"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User } from "@/lib/auth/session";
import { CreateReportSchemaInput } from "@/lib/report/validation";
import { UseFormReturn } from "react-hook-form";
import { EmployeeInput } from "./EmployeeInput";

type SaleDetailFormProps = {
  users: User[];
  form: UseFormReturn<CreateReportSchemaInput>;
};
export function SaleDetailForm({ users, form }: SaleDetailFormProps) {
  const addedEmployees = form.watch("employees");

  return (
    <Form {...form}>
      <form className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <FormField
            name="totalSales"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Total sales</FormLabel>
                <FormControl>
                  <Input {...field} type="number" placeholder="0.00" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="cardSales"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Card net sales</FormLabel>
                <FormControl>
                  <Input {...field} type="number" placeholder="0.00" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          <FormField
            name="uberEatsSales"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Uber Eats</FormLabel>
                <FormControl>
                  <Input {...field} type="number" placeholder="0.00" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="doorDashSales"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Door Dash</FormLabel>
                <FormControl>
                  <Input {...field} type="number" placeholder="0.00" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="skipTheDishesSales"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Skip Dishes</FormLabel>
                <FormControl>
                  <Input {...field} type="number" placeholder="0.00" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="onlineSales"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Online</FormLabel>
                <FormControl>
                  <Input {...field} type="number" placeholder="0.00" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          name="expenses"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Expenses</FormLabel>
              <FormControl>
                <Input {...field} type="number" placeholder="0.00" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="expensesReason"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Expenses reason</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Reason for expenses" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-3 gap-2">
          <FormField
            name="cardTips"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Card tips</FormLabel>
                <FormControl>
                  <Input {...field} type="number" placeholder="0.00" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="cashTips"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Cash tips</FormLabel>
                <FormControl>
                  <Input {...field} type="number" placeholder="0.00" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="extraTips"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Extra tips</FormLabel>
                <FormControl>
                  <Input {...field} type="number" placeholder="0.00" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          name="employees"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <p
                className={`text-sm font-semibold ${form.getFieldState("employees").invalid && "text-destructive"}`}
              >
                Employees
              </p>
              <FormControl>
                <EmployeeInput
                  users={users}
                  employees={field.value}
                  formSetValue={form.setValue}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {addedEmployees.length > 0 && (
          <div className="mx-auto w-fit rounded border bg-muted p-4 shadow">
            {addedEmployees.map((employee, index) => (
              <div
                key={index}
                className="flex items-center justify-between space-x-4 border-b p-1 text-sm"
              >
                <p className="font-semibold">{employee.name}</p>
                <p>{employee.fullDay ? "Full day" : "Half day"}</p>
              </div>
            ))}
          </div>
        )}
      </form>
    </Form>
  );
}
