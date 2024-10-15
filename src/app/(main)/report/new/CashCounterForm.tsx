"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CreateReportSchemaTypes } from "@/lib/report/validation";
import { formatPrice } from "@/lib/utils";
import { CashType } from "@/types";
import { UseFormReturn } from "react-hook-form";

// const CashCounterSchema = z.object({
//   cent5: z.coerce.number().gte(0, "Invalid"),
//   cent10: z.coerce.number().gte(0, "Invalid"),
//   cent25: z.coerce.number().gte(0, "Invalid"),
//   dollar1: z.coerce.number().gte(0, "Invalid"),
//   dollar2: z.coerce.number().gte(0, "Invalid"),
//   dollar5: z.coerce.number().gte(0, "Invalid"),
//   dollar10: z.coerce.number().gte(0, "Invalid"),
//   dollar20: z.coerce.number().gte(0, "Invalid"),
//   dollar50: z.coerce.number().gte(0, "Invalid"),
//   dollar100: z.coerce.number().gte(0, "Invalid"),
//   roll5c: z.coerce.number().gte(0, "Invalid"),
//   roll10c: z.coerce.number().gte(0, "Invalid"),
//   roll25c: z.coerce.number().gte(0, "Invalid"),
//   roll1: z.coerce.number().gte(0, "Invalid"),
//   roll2: z.coerce.number().gte(0, "Invalid"),
// });
// export type CashCounterSchemaTypes = z.infer<typeof CashCounterSchema>;

// type CashTypes = keyof CashCounterSchemaTypes;

// const moneyFields = Object.keys(CashCounterSchema.shape) as CashTypes[];

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
  createReportForm: UseFormReturn<CreateReportSchemaTypes>;
  cashCounterForm: UseFormReturn<{ [key in CashType]: number }>;
};

export function CashCounterForm({
  createReportForm,
  cashCounterForm,
}: CashCounterFormProps) {
  // Calculate the total cash in till based on the money type and quantity
  function calculateCashInTill() {
    let total = 0;
    for (const field of MoneyFields) {
      total += cashCounterForm.getValues(field) * moneyValues.get(field)!.value;
    }
    createReportForm.setValue("cashInTill", total);
  }

  return (
    <Form {...cashCounterForm}>
      <form className="space-y-2">
        <h2 className="text-sm font-semibold">Cash in till</h2>

        <div className="w-fit rounded-md border border-primary p-2 px-4 text-sm text-primary">
          <h3>Total: {formatPrice(createReportForm.watch("cashInTill"))}</h3>
        </div>

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
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>
      </form>
    </Form>
  );
}
