"use client";

import { InputField } from "@/components/ui/form/input-field";
import { User } from "@/lib/auth/session";
import { use } from "react";
import { EmployeeInput } from "./employee-input";

type SaleDetailFormProps = {
  usersPromise: Promise<User[]>;
};
export function SaleDetailForm({ usersPromise }: SaleDetailFormProps) {
  const users = use(usersPromise);

  return (
    <form className="space-y-2">
      <div className="grid grid-cols-2 gap-4">
        <InputField
          nameInSchema="totalSales"
          fieldTitle="Total sales"
          placeholder="0.00"
          type="number"
        />

        <InputField
          nameInSchema="cardSales"
          fieldTitle="Card net sales"
          placeholder="0.00"
          type="number"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <InputField
          nameInSchema="uberEatsSales"
          fieldTitle="UberEats"
          placeholder="0.00"
          type="number"
        />

        <InputField
          nameInSchema="doorDashSales"
          fieldTitle="DoorDash"
          placeholder="0.00"
          type="number"
        />

        <InputField
          nameInSchema="onlineSales"
          fieldTitle="Ritual (online)"
          placeholder="0.00"
          type="number"
        />

        <InputField
          nameInSchema="skipTheDishesSales"
          fieldTitle="Skip the Dishes"
          placeholder="0.00"
          type="number"
        />
      </div>

      <InputField
        nameInSchema="expenses"
        fieldTitle="Expenses"
        placeholder="0.00"
        type="number"
      />

      <InputField
        nameInSchema="expensesReason"
        fieldTitle="Expenses reason"
        placeholder="Reason for expenses"
      />

      <div className="grid grid-cols-3 gap-4">
        <InputField
          nameInSchema="cardTips"
          fieldTitle="Card tips"
          placeholder="0.00"
          type="number"
        />

        <InputField
          nameInSchema="cashTips"
          fieldTitle="Cash tips"
          placeholder="0.00"
          type="number"
        />

        <InputField
          nameInSchema="extraTips"
          fieldTitle="Extra tips"
          placeholder="0.00"
          type="number"
        />
      </div>

      <EmployeeInput users={users} />
    </form>
  );
}
