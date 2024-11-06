"use client";

import { cn, formatPriceWithDollar } from "@/lib/utils";
import moment from "moment";
import { Separator } from "./ui/separator";
import { SaleReportCardProcessedData } from "@/types";
import { ProfilePicture } from "./ProfilePicture";

type SaleReportProps = {
  data: SaleReportCardProcessedData | undefined;
};

export function SaleReportCard({ data }: SaleReportProps) {
  if (!data) {
    return null;
  }

  return (
    <div className="w-full space-y-2 rounded border p-2 text-sm shadow">
      <div className="flex items-center justify-between space-x-2">
        <div className="font-medium">
          {moment(data.date).format("ddd MMM Do, YYYY")}
        </div>

        <div className="flex items-center space-x-1 text-muted-foreground">
          {data.reporterImage && (
            <ProfilePicture image={data.reporterImage} size={40} />
          )}
          <span>{data.reporterName}</span>
        </div>
      </div>

      <Separator />

      <div className="flex gap-2 border-l-[3px] border-l-green-500">
        <ReportBlock label="Total Sales" data={data.totalSales} />
      </div>

      <Separator />

      <div className="grid grid-cols-3 items-center gap-2">
        <ReportBlock label="In-store Sales" data={data.inStoreSales} />

        <div className="col-span-2 space-y-1">
          <ReportBlock
            label="Card sales"
            data={data.cardSales}
            blockCn="bg-muted flex gap-1 shadow-sm"
            secondaryData
          />

          <ReportBlock
            label="Cash sales"
            data={data.cashSales}
            blockCn="bg-muted flex gap-1 shadow-sm"
            secondaryData
          />
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-3 items-center gap-2">
        <ReportBlock label="Online Sales" data={data.otherSales} />

        <div className="col-span-2 space-y-1">
          <ReportBlock
            label="UberEats"
            data={data.uberEatsSales}
            blockCn="bg-muted flex gap-1 shadow-sm"
            secondaryData
          />
          <ReportBlock
            label="DoorDash"
            data={data.doorDashSales}
            blockCn="bg-muted flex gap-1 shadow-sm"
            secondaryData
          />
          <ReportBlock
            label="Ritual"
            data={data.onlineSales}
            blockCn="bg-muted flex gap-1 shadow-sm"
            secondaryData
          />
          <ReportBlock
            label="SkipDishes"
            data={data.skipTheDishesSales}
            blockCn="bg-muted flex gap-1 shadow-sm"
            secondaryData
          />
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-3 items-center gap-2">
        <ReportBlock label="Expenses" data={data.expenses} />

        <div className="col-span-2 space-y-1">
          {data.expensesReason && (
            <ReportBlock
              data={data.expensesReason}
              blockCn="bg-muted flex gap-1 shadow-sm"
            />
          )}
        </div>
      </div>

      <Separator />

      <div
        className={cn(
          `flex flex-col gap-2 border-l-[3px]`,
          data.cashDifference < -3.0 ? "border-l-orange-500" : "border-l-0",
        )}
      >
        <ReportBlock label="Cash Difference" data={data.cashDifference} />

        <div className="flex items-center gap-2 px-2 pb-1">
          <ReportBlock
            label="Cash in Till"
            data={data.cashInTill}
            blockCn="bg-muted  shadow-sm"
            secondaryData
          />
          <span>-</span>
          <ReportBlock
            label="Start Cash"
            data={data.startCash}
            blockCn="bg-muted shadow-sm"
            secondaryData
          />
          <span>-</span>
          <ReportBlock
            label="Actual Cash"
            data={data.actualCash}
            blockCn="bg-muted shadow-sm"
            secondaryData
          />
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-2">
        <ReportBlock label="Cash Out" data={data.cashOut} />

        <div className="flex items-center gap-2 px-2 pb-1">
          <ReportBlock
            label="Taken from Till"
            data={data.cashInTill - data.startCash}
            blockCn="bg-muted shadow-sm"
            secondaryData
          />
          <span>+</span>
          <ReportBlock
            label="Cash Tips"
            data={data.cashTips}
            blockCn="bg-muted shadow-sm"
            secondaryData
          />
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-3 items-center gap-2">
        <ReportBlock label="Total Tips" data={data.totalTips} />

        <div className="col-span-2 space-y-1">
          <ReportBlock
            label="Card Tips"
            data={data.cardTips}
            blockCn="bg-muted flex gap-1 shadow-sm"
            secondaryData
          />
          <ReportBlock
            label="Cash Tips"
            data={data.cashTips}
            blockCn="bg-muted flex gap-1 shadow-sm"
            secondaryData
          />
          <ReportBlock
            label="Extra Tips"
            data={data.extraTips}
            blockCn="bg-muted flex gap-1 shadow-sm"
            secondaryData
          />
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-2">
        <div className="rounded-lg px-2 py-1">
          <p className="font-semibold">Tips Breakdown</p>
          <p className="text-muted-foreground">
            {formatPriceWithDollar(data.totalTips)} / {data.totalPeople} ={" "}
            {formatPriceWithDollar(data.tipsPerPerson)}
          </p>
        </div>

        <div className="space-y-1 px-2 pb-1">
          {data.employees.map((emp) => (
            <div
              key={emp.userId}
              className="flex items-center space-x-2 rounded-lg bg-muted px-2 py-1 shadow-sm"
            >
              {emp.image && <ProfilePicture image={emp.image} size={40} />}
              <span className="font-medium">{emp.name}</span>
              <span className="text-muted-foreground">
                {data.totalPeople > 1
                  ? emp.fullDay
                    ? formatPriceWithDollar(data.tipsPerPerson)
                    : formatPriceWithDollar(data.tipsPerPerson / 2)
                  : formatPriceWithDollar(data.totalTips)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReportBlock({
  label,
  data,
  blockCn,
  secondaryData,
}: {
  label?: string;
  data: number | string;
  blockCn?: string;
  secondaryData?: boolean;
}) {
  return (
    <div className={cn(`rounded-lg px-2 py-1`, blockCn)}>
      {label && (
        <p
          className={cn(
            "flex items-center gap-1",
            secondaryData ? "font-medium" : "font-semibold",
          )}
        >
          {label}
        </p>
      )}
      <p className="text-muted-foreground">
        {typeof data === "number" ? formatPriceWithDollar(data) : data}
      </p>
    </div>
  );
}
