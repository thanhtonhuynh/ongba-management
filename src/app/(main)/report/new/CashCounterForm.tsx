"use client";

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

const moneyValues = new Map([
  ["coin2", { label: "$2", value: 2 }],
  ["coin1", { label: "$1", value: 1 }],
  ["coin25c", { label: "25c", value: 0.25 }],
  ["coin10c", { label: "10c", value: 0.1 }],
  ["coin5c", { label: "5c", value: 0.05 }],
  ["bill100", { label: "$100", value: 100 }],
  ["bill50", { label: "$50", value: 50 }],
  ["bill20", { label: "$20", value: 20 }],
  ["bill10", { label: "$10", value: 10 }],
  ["bill5", { label: "$5", value: 5 }],
  ["roll2", { label: "$2", value: 50 }],
  ["roll1", { label: "$1", value: 25 }],
  ["roll25c", { label: "25c", value: 10 }],
  ["roll10c", { label: "10c", value: 5 }],
  ["roll5c", { label: "5c", value: 2 }],
]);

const MoneyFields = Array.from(moneyValues.keys()) as CashType[];
const CoinFields = MoneyFields.filter((key) => key.startsWith("coin"));
const BillFields = MoneyFields.filter((key) => key.startsWith("bill"));
const RollFields = MoneyFields.filter((key) => key.startsWith("roll"));

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
    for (const field of MoneyFields) {
      total += cashCounterForm.getValues(field) * moneyValues.get(field)!.value;
    }
    createReportForm.setValue("cashInTill", total);
  }

  return (
    <Form {...cashCounterForm}>
      <form className="space-y-3">
        <h2 className="text-sm font-semibold">Cash in till</h2>

        <div className="rounded-md border p-2 shadow">
          <h3 className="text-sm font-semibold">Bills</h3>
          <div className="flex justify-center space-x-2">
            {BillFields.map((key) => (
              <FormField
                key={key}
                name={key}
                control={cashCounterForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{moneyValues.get(key)!.label}</FormLabel>
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
            {CoinFields.map((key) => (
              <FormField
                key={key}
                name={key}
                control={cashCounterForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{moneyValues.get(key)!.label}</FormLabel>
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
            {RollFields.map((key) => (
              <FormField
                key={key}
                name={key}
                control={cashCounterForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{moneyValues.get(key)!.label}</FormLabel>
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
                <FormLabel className="font-semibold">
                  Total Cash in Till
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value}
                    onChange={field.onChange}
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
