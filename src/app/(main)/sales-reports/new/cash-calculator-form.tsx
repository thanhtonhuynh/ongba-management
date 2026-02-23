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
import { SaleReportInputs } from "@/lib/validations/report";
import { CashType } from "@/types";
import { UseFormReturn } from "react-hook-form";

type Props = {
  saleReportForm: UseFormReturn<SaleReportInputs>;
  cashCounterForm: UseFormReturn<{ [key in CashType]: number }>;
};

export function CashCalculatorForm({ saleReportForm, cashCounterForm }: Props) {
  function calculateCashInTill() {
    let total = 0;
    for (const field of MONEY_FIELDS) {
      total +=
        cashCounterForm.getValues(field) * MONEY_VALUES.get(field)!.value;
    }
    saleReportForm.setValue("cashInTill", Math.round(total * 100) / 100);
  }

  return (
    <Form {...cashCounterForm}>
      <form className="space-y-2">
        <div className="bg-background flex flex-col items-center rounded-xl border border-blue-950 p-3">
          <h3 className="mb-2 text-sm font-medium tracking-wide uppercase">
            Total Cash in Till
          </h3>
          <FormField
            name="cashInTill"
            control={saleReportForm.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value}
                    onChange={field.onChange}
                    className="text-primary text-sm font-bold"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="bg-background space-y-2 rounded-xl border border-blue-950 p-3">
            <h4 className="text-sm font-medium tracking-wide uppercase">
              Bills
            </h4>

            <div className="flex flex-row gap-2 sm:flex-col">
              {BILL_FIELDS.map((key) => (
                <FormField
                  key={key}
                  name={key}
                  control={cashCounterForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground text-xs tracking-wide">
                        {MONEY_VALUES.get(key)!.label}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e);
                            calculateCashInTill();
                          }}
                          onFocus={(e) => e.target.select()}
                          className="text-sm"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>

          <div className="bg-background space-y-2 rounded-xl border border-blue-950 p-3">
            <h4 className="text-sm font-medium tracking-wide uppercase">
              Coins
            </h4>
            <div className="flex flex-row gap-2 sm:flex-col">
              {COIN_FIELDS.map((key) => (
                <FormField
                  key={key}
                  name={key}
                  control={cashCounterForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground text-xs tracking-wide">
                        {MONEY_VALUES.get(key)!.label}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e);
                            calculateCashInTill();
                          }}
                          onFocus={(e) => e.target.select()}
                          className="text-sm"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>

          <div className="bg-background space-y-2 rounded-xl border border-blue-950 p-3">
            <h4 className="text-sm font-medium tracking-wide uppercase">
              Rolls
            </h4>
            <div className="flex flex-row gap-2 sm:flex-col">
              {ROLL_FIELDS.map((key) => (
                <FormField
                  key={key}
                  name={key}
                  control={cashCounterForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground text-xs tracking-wide">
                        {MONEY_VALUES.get(key)!.label}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e);
                            calculateCashInTill();
                          }}
                          onFocus={(e) => e.target.select()}
                          className="text-sm"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
