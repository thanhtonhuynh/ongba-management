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
    <div className="space-y-3 text-sm">
      <div className="flex items-center justify-between">
        <div className="rounded-lg border bg-muted px-2">
          {moment(data.date).format("ddd MMM D, YYYY")}
        </div>

        <div className="flex items-center space-x-1 text-muted-foreground">
          {data.reporterImage && (
            <ProfilePicture image={data.reporterImage} size={40} />
          )}
          <span>{data.reporterName}</span>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-8">
        <div className="space-y-3">
          <ReportBlock label="Total Sales" data={data.totalSales} />

          <Separator />

          <ReportBlock label="In-store Sales" data={data.inStoreSales} />

          <div className="flex gap-8">
            <ReportBlock
              label="Card sales"
              data={data.cardSales}
              secondaryData
            />
            <ReportBlock
              label="Cash sales"
              data={data.cashSales}
              secondaryData
            />
          </div>

          <Separator />

          <ReportBlock label="Online Sales" data={data.otherSales} />

          <div className="flex gap-6 sm:gap-8">
            <ReportBlock
              label="UberEats"
              data={data.uberEatsSales}
              secondaryData
            />

            <ReportBlock
              label="DoorDash"
              data={data.doorDashSales}
              secondaryData
            />

            <ReportBlock label="Ritual" data={data.onlineSales} secondaryData />

            <ReportBlock
              label="SkipDishes"
              data={data.skipTheDishesSales}
              secondaryData
            />
          </div>

          <Separator />

          <ReportBlock
            label="Expenses"
            data={`${formatPriceWithDollar(data.expenses)} ${
              data.expensesReason && ` - ${data.expensesReason}`
            }`}
          />

          <Separator />

          <ReportBlock label="Cash Difference" data={data.cashDifference} />

          <div className="flex items-center gap-4">
            <ReportBlock
              label="Cash in Till"
              data={data.cashInTill}
              secondaryData
            />
            <span>-</span>
            <ReportBlock
              label="Start Cash"
              data={data.startCash}
              secondaryData
            />
            <span>-</span>
            <ReportBlock
              label="Actual Cash"
              data={data.actualCash}
              secondaryData
            />
          </div>

          <Separator />

          <ReportBlock label="Cash Out" data={data.cashOut} />

          <div className="flex items-center gap-4">
            <ReportBlock
              label="Taken from Till"
              data={data.cashInTill - data.startCash}
              secondaryData
            />
            <span>+</span>
            <ReportBlock label="Cash Tips" data={data.cashTips} secondaryData />
          </div>
        </div>

        <Separator className="md:hidden" />

        <div className="space-y-3">
          <ReportBlock label="Total Tips" data={data.totalTips} />

          <div className="flex gap-8">
            <ReportBlock label="Card Tips" data={data.cardTips} secondaryData />
            <ReportBlock label="Cash Tips" data={data.cashTips} secondaryData />
            <ReportBlock
              label="Extra Tips"
              data={data.extraTips}
              secondaryData
            />
          </div>

          <Separator />

          <ReportBlock
            label="Tips Breakdown"
            data={`${formatPriceWithDollar(data.totalTips)} / ${data.totalPeople} =
              ${formatPriceWithDollar(data.tipsPerPerson)}`}
          />

          <div className="space-y-1">
            {data.employees.map((emp) => (
              <div
                key={emp.userId}
                className="flex h-12 items-center space-x-2 rounded bg-muted px-2 shadow-sm"
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
    </div>
  );
}

function ReportBlock({
  label,
  data,
  secondaryData,
}: {
  label?: string;
  data: number | string;
  secondaryData?: boolean;
}) {
  return (
    <div>
      {label && (
        <p
          className={cn(
            "font-bold",
            // secondaryData && "font-medium text-muted-foreground",
            secondaryData && "font-medium",
          )}
        >
          {label}
        </p>
      )}

      <p
        className={cn(
          // "text-blue-500",
          "text-muted-foreground",
          secondaryData && "text-muted-foreground",
        )}
      >
        {typeof data === "number" ? formatPriceWithDollar(data) : data}
      </p>
    </div>
  );
}
