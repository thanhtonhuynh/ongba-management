"use client";

import {
  BILL_FIELDS,
  COIN_FIELDS,
  MONEY_FIELDS,
  MONEY_VALUES,
  ROLL_FIELDS,
} from "@/app/constants";
import { Typography } from "@/components/typography";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formatMoney } from "@/lib/utils";
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
      <form className="mx-auto w-full max-w-5xl space-y-6">
        <Card className="gap-3 p-6">
          <Typography variant="h2" className="uppercase">
            Total Cash in Till
          </Typography>
          <span className="text-primary text-xl font-bold">
            {formatMoney(total)}
          </span>
        </Card>

        <div className="grid gap-6 sm:grid-cols-3">
          <Card className="p-6">
            <Typography variant="h3">Bills</Typography>

            <div className="flex flex-row gap-3 sm:flex-col">
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
          </Card>

          <Card className="p-6">
            <Typography variant="h3">Coins</Typography>

            <div className="flex flex-row gap-3 sm:flex-col">
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
          </Card>

          <Card className="p-6">
            <Typography variant="h3">Rolls</Typography>

            <div className="flex flex-row gap-3 sm:flex-col">
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
          </Card>
        </div>
      </form>
    </Form>
  );
}
