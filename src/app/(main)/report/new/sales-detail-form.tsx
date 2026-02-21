"use client";

import { InputField } from "@/components/ui/form/input-field";
import { getPlatformById } from "@/constants/platforms";
import { SaleReportInputs } from "@/lib/validations/report";
import { DisplayUser } from "@/types";
import { use } from "react";
import { useFormContext } from "react-hook-form";
import { EmployeeInput } from "./employee-input";

type Props = {
  usersPromise: Promise<DisplayUser[]>;
};
export function SalesDetailForm({ usersPromise }: Props) {
  const users = use(usersPromise);
  const form = useFormContext<SaleReportInputs>();

  return (
    <form className="space-y-2">
      <div className="bg-background space-y-2 rounded-xl border border-blue-950 p-3">
        <h3 className="text-sm font-medium tracking-wide uppercase">Sales</h3>

        <div className="grid grid-cols-2 gap-2">
          <InputField
            nameInSchema="totalSales"
            fieldTitle="Total Sales"
            placeholder="0.00"
            type="number"
            labelClassName="text-muted-foreground text-xs tracking-wide"
            inputClassName="text-sm"
          />

          <InputField
            nameInSchema="cardSales"
            fieldTitle="Card Net Sales"
            placeholder="0.00"
            type="number"
            labelClassName="text-muted-foreground text-xs tracking-wide"
            inputClassName="text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {form.getValues("platformSales").map((platform, index) => {
            const platformInfo = getPlatformById(platform.platformId);
            if (!platformInfo) return null;

            return (
              <InputField
                key={platform.platformId}
                nameInSchema={`platformSales.${index}.amount`}
                fieldTitle={platformInfo.label}
                placeholder="0.00"
                type="number"
                labelClassName="text-muted-foreground text-xs tracking-wide"
                inputClassName="text-sm"
              />
            );
          })}
        </div>
      </div>

      <div className="bg-background space-y-2 rounded-xl border border-blue-950 p-3">
        <h3 className="text-sm font-medium tracking-wide uppercase">
          Expenses
        </h3>

        <InputField
          nameInSchema="expenses"
          fieldTitle="Amount"
          placeholder="0.00"
          type="number"
          labelClassName="text-muted-foreground text-xs tracking-wide"
          inputClassName="text-sm"
        />

        <InputField
          nameInSchema="expensesReason"
          fieldTitle="Reason"
          placeholder="e.g., lime"
          labelClassName="text-muted-foreground text-xs tracking-wide"
          inputClassName="text-sm"
        />
      </div>

      <div className="bg-background space-y-2 rounded-xl border border-blue-950 p-3">
        <h3 className="text-sm font-medium tracking-wide uppercase">Tips</h3>

        <div className="grid grid-cols-3 gap-2">
          <InputField
            nameInSchema="cardTips"
            fieldTitle="Card"
            placeholder="0.00"
            type="number"
            labelClassName="text-muted-foreground text-xs tracking-wide"
            inputClassName="text-sm"
          />

          <InputField
            nameInSchema="cashTips"
            fieldTitle="Cash"
            placeholder="0.00"
            type="number"
            labelClassName="text-muted-foreground text-xs tracking-wide"
            inputClassName="text-sm"
          />

          <InputField
            nameInSchema="extraTips"
            fieldTitle="Extra"
            placeholder="0.00"
            type="number"
            labelClassName="text-muted-foreground text-xs tracking-wide"
            inputClassName="text-sm"
          />
        </div>
      </div>

      <div className="bg-background space-y-3 rounded-xl border border-blue-950 p-3">
        <h3 className="text-sm font-medium tracking-wide uppercase">
          Employees
        </h3>

        <EmployeeInput users={users} />
      </div>
    </form>
  );
}
