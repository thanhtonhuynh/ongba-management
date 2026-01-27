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
import { formatPriceWithDollar } from "@/lib/utils";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function CashCalculator() {
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
      <form className="mx-auto max-w-2xl space-y-8">
        <div className="bg-muted/50 flex flex-col items-center rounded-lg p-4">
          <h3 className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
            Total Cash in Till
          </h3>
          <p className="text-primary text-xl font-bold">
            {formatPriceWithDollar(total)}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <div className="bg-muted/50 space-y-4 rounded-lg p-4">
            <h4 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Bills
            </h4>
            <div className="flex flex-row gap-2 sm:flex-col">
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

          <div className="bg-muted/50 space-y-4 rounded-lg p-4">
            <h4 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Coins
            </h4>
            <div className="flex flex-row gap-2 sm:flex-col">
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

          <div className="bg-muted/50 space-y-4 rounded-lg p-4">
            <h4 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Rolls
            </h4>
            <div className="flex flex-row gap-2 sm:flex-col">
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
        </div>
      </form>
    </Form>
  );
}
