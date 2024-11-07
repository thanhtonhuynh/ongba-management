"use client";

import {
  BILL_FIELDS,
  COIN_FIELDS,
  MONEY_FIELDS,
  MONEY_VALUES,
  ROLL_FIELDS,
} from "@/app/constants";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CreateReportSchemaInput } from "@/lib/validations/report";
import { CashType } from "@/types";
import { UseFormReturn } from "react-hook-form";

type CashCounterFormProps = {
  createReportForm: UseFormReturn<CreateReportSchemaInput>;
  cashCounterForm: UseFormReturn<{ [key in CashType]: number }>;
};

export function CashCounterForm({
  createReportForm,
  cashCounterForm,
}: CashCounterFormProps) {
  function calculateCashInTill() {
    let total = 0;
    for (const field of MONEY_FIELDS) {
      total +=
        cashCounterForm.getValues(field) * MONEY_VALUES.get(field)!.value;
    }
    createReportForm.setValue("cashInTill", Math.round(total * 100) / 100);
  }

  return (
    <Form {...cashCounterForm}>
      <form className="space-y-3">
        <h2 className="text-sm">Cash in till</h2>

        <div className="rounded-md border p-2 shadow">
          <h3 className="text-sm font-semibold">Bills</h3>
          <div className="flex justify-center space-x-2">
            {BILL_FIELDS.map((key) => (
              <FormField
                key={key}
                name={key}
                control={cashCounterForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{MONEY_VALUES.get(key)!.label}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e);
                          calculateCashInTill();
                        }}
                        onFocus={(e) => e.target.select()}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        <div className="rounded-md border p-2 shadow">
          <h3 className="text-sm font-semibold">Coins</h3>
          <div className="flex justify-center space-x-2">
            {COIN_FIELDS.map((key) => (
              <FormField
                key={key}
                name={key}
                control={cashCounterForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{MONEY_VALUES.get(key)!.label}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e);
                          calculateCashInTill();
                        }}
                        onFocus={(e) => e.target.select()}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        <div className="rounded-md border p-2 shadow">
          <h3 className="text-sm font-semibold">Rolls</h3>
          <div className="flex justify-center space-x-2">
            {ROLL_FIELDS.map((key) => (
              <FormField
                key={key}
                name={key}
                control={cashCounterForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{MONEY_VALUES.get(key)!.label}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e);
                          calculateCashInTill();
                        }}
                        onFocus={(e) => e.target.select()}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        <div className="mx-auto w-fit">
          <FormField
            name="cashInTill"
            control={createReportForm.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-blue-500">
                  Total Cash in Till
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value}
                    onChange={field.onChange}
                    className="text-blue-500"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
