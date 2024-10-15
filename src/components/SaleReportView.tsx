"use client";

import { useSession } from "@/contexts/SessionProvider";
import { formatPrice } from "@/lib/utils";
import { SaleReport } from "@prisma/client";
import moment from "moment";
import { Separator } from "./ui/separator";
import { MoveRight } from "lucide-react";
import { SaleEmployee } from "@/types";
import { User } from "@/lib/auth/session";
import { CreateReportSchemaTypes } from "@/lib/report/validation";

const START_CASH = 300.0;

type SaleReportProps = {
  // report: Partial<SaleReport>;
  report: CreateReportSchemaTypes;
  employees?: SaleEmployee[];
  users: User[];
};

export function SaleReportView({ report, employees, users }: SaleReportProps) {
  const { user } = useSession();

  const otherSales =
    Number(report.uberEatsSales) +
    Number(report.doorDashSales) +
    Number(report.skipTheDishesSales) +
    Number(report.onlineSales);

  const inStoreSales = report.saleTotal! - otherSales;

  const cashTotal = inStoreSales - report.cardTotal!;

  const actualCash = cashTotal - report.expenses!;

  const totalTips =
    Number(report.cardTips) +
    Number(report.cashTips) +
    Number(report.extraTips);

  const cashDifference = report.cashInTill! - START_CASH - actualCash;

  const totalPeople =
    employees?.reduce((acc, emp) => acc + (emp.fullDay ? 1 : 0.5), 0) || 1;

  const tipsPerPerson = totalTips / totalPeople;

  return (
    <div className="flex space-x-4">
      <div className="rounded border p-2 text-sm shadow">
        <div>
          <span className="font-semibold">Date: </span>
          {moment(new Date()).format("YYYY/MM/DD")}
        </div>

        <div className="flex justify-between space-x-2">
          <p>
            <span className="font-semibold">Day: </span>
            {moment(new Date()).format("ddd")}
          </p>

          <p>
            <span className="font-semibold">By: </span>
            {user?.name}
          </p>
        </div>

        <Separator className="my-1" />

        <div>
          <span className="font-semibold">Total: </span>
          {formatPrice(inStoreSales)} + {formatPrice(otherSales)} ={" "}
          {formatPrice(report.saleTotal!)}
        </div>

        <Separator className="my-1" />

        <div>
          <span className="font-semibold">Card (net sales): </span>
          {formatPrice(report.cardTotal!)}
        </div>

        <Separator className="my-1" />

        <div className="">
          <span className="font-semibold">Cash: </span>
          {formatPrice(cashTotal)}
        </div>

        <Separator className="my-1" />

        <div>
          <span className="font-semibold">Expenses: </span>
          {formatPrice(report.expenses!)}
        </div>

        <Separator className="my-1" />

        <div>
          <span className="font-semibold">Actual Cash: </span>
          {formatPrice(actualCash)}
        </div>

        <Separator className="my-1" />

        <div className="flex items-center justify-between">
          <div>
            <div>
              <span className="font-semibold">Card Tips: </span>
              {formatPrice(report.cardTips!)}
            </div>
            <div>
              <span className="font-semibold">Cash Tips: </span>
              {formatPrice(report.cashTips!)}
            </div>
            <div>
              <span className="font-semibold">Extra Tips: </span>
              {formatPrice(report.extraTips!)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <MoveRight size={20} />
            {formatPrice(totalTips)}
          </div>
        </div>

        <Separator className="my-1" />

        <div>
          <span className="font-semibold">Sales Detail: </span>

          <div>
            ({formatPrice(report.cashInTill!)} - {START_CASH}) -{" "}
            {formatPrice(actualCash)} = {formatPrice(cashDifference)}
          </div>

          <div className="mt-2 grid grid-cols-2">
            <div>UE: {formatPrice(report.uberEatsSales!)}</div>
            <div>DD: {formatPrice(report.doorDashSales!)}</div>
            <div>SK: {formatPrice(report.skipTheDishesSales!)}</div>
            <div>ON: {formatPrice(report.onlineSales!)}</div>
          </div>
        </div>
      </div>

      <div className="self-start rounded border p-2 text-sm shadow">
        <div>
          <span className="font-semibold">Tips: </span> {formatPrice(totalTips)}{" "}
          / {totalPeople} = {formatPrice(tipsPerPerson)}
        </div>

        <Separator className="my-1" />

        <div>
          {employees?.map((emp) => (
            <div key={emp.userId}>
              {users.find((u) => u.id === emp.userId)?.name}:{" "}
              {emp.fullDay
                ? formatPrice(tipsPerPerson)
                : formatPrice(tipsPerPerson / 2)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
