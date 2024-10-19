"use client";

import { formatPrice } from "@/lib/utils";
import moment from "moment";
import { Separator } from "./ui/separator";
import { MoveRight } from "lucide-react";
import { SaleReportCardProcessedData } from "@/types";

type SaleReportProps = {
  data: SaleReportCardProcessedData | undefined;
};

export function SaleReportCard({ data }: SaleReportProps) {
  if (!data) {
    return null;
  }

  return (
    <div className="w-full rounded border p-2 text-sm shadow">
      <div>
        <span className="font-semibold">Date: </span>
        {moment(data.date).format("YYYY/MM/DD HH:mm:ss")}
      </div>

      <div className="flex justify-between space-x-2">
        <p>
          <span className="font-semibold">Day: </span>
          {moment(data.date).format("ddd")}
        </p>

        <p>
          <span className="font-semibold">By: </span>
          {data.reporterName}
        </p>
      </div>

      <Separator className="my-1" />

      <div>
        <span className="font-semibold">Total: </span>
        {formatPrice(data.inStoreSales)} + {formatPrice(data.otherSales)} ={" "}
        {formatPrice(data.totalSales)}
      </div>

      <Separator className="my-1" />

      <div>
        <span className="font-semibold">Card (net sales): </span>
        {formatPrice(data.cardSales)}
      </div>

      <Separator className="my-1" />

      <div className="">
        <span className="font-semibold">Cash: </span>
        {formatPrice(data.cashSales)}
      </div>

      <Separator className="my-1" />

      <div>
        <span className="font-semibold">Expenses: </span>
        {formatPrice(data.expenses)}{" "}
        {data.expensesReason && `(${data.expensesReason})`}
      </div>

      <Separator className="my-1" />

      <div>
        <span className="font-semibold">Actual Cash: </span>
        {formatPrice(data.actualCash)}
      </div>

      <Separator className="my-1" />

      <div className="flex items-center gap-4">
        <div>
          <div>
            <span className="font-semibold">Card Tips: </span>
            {formatPrice(data.cardTips)}
          </div>
          <div>
            <span className="font-semibold">Cash Tips: </span>
            {formatPrice(data.cashTips)}
          </div>
          <div>
            <span className="font-semibold">Extra Tips: </span>
            {formatPrice(data.extraTips)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <MoveRight size={20} />
          {formatPrice(data.totalTips)}
        </div>
      </div>

      <Separator className="my-1" />

      <div>
        <div>
          <span className="font-semibold">Sales Detail: </span>(
          {formatPrice(data.cashInTill)} - {data.startCash}) -{" "}
          {formatPrice(data.actualCash)} = {formatPrice(data.cashDifference)}
        </div>

        <div className="mt-2 grid grid-cols-2">
          <div>UE: {formatPrice(data.uberEatsSales)}</div>
          <div>DD: {formatPrice(data.doorDashSales)}</div>
          <div>SK: {formatPrice(data.skipTheDishesSales)}</div>
          <div>ON: {formatPrice(data.onlineSales)}</div>
        </div>
      </div>

      <Separator className="my-1" />

      <div>
        <span className="font-semibold">Tips: </span>{" "}
        {formatPrice(data.totalTips)} / {data.totalPeople} ={" "}
        {formatPrice(data.tipsPerPerson)}
      </div>
      <Separator className="my-1" />

      <div>
        {data.employees.map((emp) => (
          <div key={emp.userId}>
            {emp.name}:{" "}
            {emp.fullDay
              ? formatPrice(data.tipsPerPerson)
              : formatPrice(data.tipsPerPerson / 2)}
          </div>
        ))}
      </div>
    </div>
  );
}
