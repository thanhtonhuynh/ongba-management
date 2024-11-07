"use client";

import {
  MONEY_FIELDS,
  MONEY_VALUES,
  BILL_FIELDS,
  COIN_FIELDS,
  ROLL_FIELDS,
} from "@/app/constants";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formatPriceWithDollar } from "@/lib/utils";

export function CashCounter() {
  const form = useForm({
    defaultValues: {
      coin5c: 0,
      coin10c: 0,
      coin25c: 0,
      coin1: 0,
      coin2: 0,
      bill5: 0,
      bill10: 0,
      bill20: 0,
      bill50: 0,
      bill100: 0,
      roll5c: 0,
      roll10c: 0,
      roll25c: 0,
      roll1: 0,
      roll2: 0,
    },
  });
  const [total, setTotal] = useState(0);

  function calculateCashInTill() {
    setTotal(
      MONEY_FIELDS.reduce((acc, field) => {
        return acc + form.getValues(field) * MONEY_VALUES.get(field)!.value;
      }, 0),
    );
  }

  return (
    <Form {...form}>
      <form className="space-y-3">
        <div className="mx-auto w-fit rounded-md border p-2 text-sm shadow">
          <h2>Total Cash in Till</h2>
          <p className="font-medium text-blue-500">
            {formatPriceWithDollar(total)}
          </p>
        </div>

        <div className="rounded-md border p-2 shadow">
          <h2 className="text-sm">Bills</h2>
          <div className="flex justify-center space-x-2">
            {BILL_FIELDS.map((key) => (
              <FormField
                key={key}
                name={key}
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-1">
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
          <h2 className="text-sm">Coins</h2>
          <div className="flex justify-center space-x-2">
            {COIN_FIELDS.map((key) => (
              <FormField
                key={key}
                name={key}
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-1">
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
          <h2 className="text-sm">Rolls</h2>
          <div className="flex justify-center space-x-2">
            {ROLL_FIELDS.map((key) => (
              <FormField
                key={key}
                name={key}
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-1">
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
      </form>
    </Form>
  );
}
