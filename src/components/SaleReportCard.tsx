"use client";

import { cn, formatPriceWithDollar } from "@/lib/utils";
import { SaleReportCardProcessedData } from "@/types";
import { Calendar, Dot } from "lucide-react";
import moment from "moment";
import { ProfilePicture } from "./ProfilePicture";
import { Separator } from "./ui/separator";

type SaleReportProps = {
  data: SaleReportCardProcessedData | undefined;
};

export function SaleReportCard({ data }: SaleReportProps) {
  if (!data) {
    return null;
  }

  return (
    <div className="space-y-2 text-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 rounded border-l-2 border-l-blue-500 bg-muted px-2 py-1 font-semibold">
          <Calendar size={15} className="text-blue-500" />
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

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-8">
        <div className="space-y-2">
          <ReportBlock label="Total Sales" data={data.totalSales} />

          <Separator />

          <div className="space-y-1">
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
          </div>

          <Separator />

          <div className="space-y-1">
            <ReportBlock label="Online Sales" data={data.otherSales} />
            <div className="flex gap-6 lg:gap-8">
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
              <ReportBlock
                label="Ritual"
                data={data.onlineSales}
                secondaryData
              />
              <ReportBlock
                label="SkipDishes"
                data={data.skipTheDishesSales}
                secondaryData
              />
            </div>
          </div>

          <Separator />

          <ReportBlock
            label="Expenses"
            data={`${formatPriceWithDollar(data.expenses)} ${
              data.expensesReason && `- ${data.expensesReason}`
            }`}
          />

          <Separator />

          <div className="space-y-1">
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
          </div>

          <Separator />

          <div className="space-y-1">
            <ReportBlock label="Cash Out" data={data.cashOut} />
            <div className="flex items-center gap-4">
              <ReportBlock
                label="Taken from Till"
                data={data.cashInTill - data.startCash}
                secondaryData
              />
              <span>+</span>
              <ReportBlock
                label="Cash Tips"
                data={data.cashTips}
                secondaryData
              />
            </div>
          </div>
        </div>

        <Separator className="md:hidden" />

        <div className="space-y-2">
          <div className="space-y-1">
            <ReportBlock label="Total Tips" data={data.totalTips} />
            <div className="flex gap-8">
              <ReportBlock
                label="Card Tips"
                data={data.cardTips}
                secondaryData
              />
              <ReportBlock
                label="Cash Tips"
                data={data.cashTips}
                secondaryData
              />
              <ReportBlock
                label="Extra Tips"
                data={data.extraTips}
                secondaryData
              />
            </div>
          </div>

          <Separator />

          <ReportBlock
            label="Tips per Hour"
            data={`${formatPriceWithDollar(data.totalTips)} / ${data.totalHours} =
              ${formatPriceWithDollar(data.tipsPerHour)}`}
          />

          <ul className="space-y-1">
            {data.employees.map((emp) => (
              <li
                key={emp.userId}
                className="flex h-12 items-center justify-between space-x-2 rounded px-2 shadow"
              >
                <div className="flex items-center space-x-2">
                  {emp.image && <ProfilePicture image={emp.image} size={30} />}
                  <span>{emp.name}</span>
                </div>

                <div className="flex items-center">
                  <span>
                    {emp.hour} {emp.hour > 1 ? "hours" : "hour"}
                  </span>

                  <Dot size={15} />

                  <span className="font-medium">
                    {formatPriceWithDollar(emp.hour * data.tipsPerHour)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
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
  label: string;
  data: number | string;
  secondaryData?: boolean;
}) {
  return (
    <div>
      <p className={cn("font-semibold", secondaryData && "font-normal")}>
        {label}
      </p>

      <p className="font-medium text-muted-foreground">
        {typeof data === "number" ? formatPriceWithDollar(data) : data}
      </p>
    </div>
  );
}
