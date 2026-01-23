"use client";

import { cn, formatPriceWithDollar } from "@/lib/utils";
import { SaleReportCardProcessedData } from "@/types";
import {
  BalanceScaleIcon,
  Calendar03Icon,
  CashIcon,
  Coins01Icon,
  DivideSignCircleIcon,
  DollarCircleIcon,
  Invoice01Icon,
  SmartPhone01Icon,
  Store01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import moment from "moment";
import Link from "next/link";
import { ProfilePicture } from "./ProfilePicture";

type SaleReportProps = {
  data: SaleReportCardProcessedData | undefined;
};

export function SaleReportCard({ data }: SaleReportProps) {
  if (!data) {
    return null;
  }

  return (
    <div className="space-y-4 text-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
            <HugeiconsIcon
              icon={Calendar03Icon}
              className="text-muted-foreground size-5"
            />
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Report Date</p>
            <p className="font-semibold">
              {moment(data.date).format("ddd MMM D, YYYY")}
            </p>
          </div>
        </div>

        <Link
          href={`/profile/${data.reporterUsername}`}
          className="group flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <ProfilePicture
            image={data.reporterImage}
            size={36}
            name={data.reporterName}
          />
          <div>
            <p className="text-muted-foreground text-xs">Reported by</p>
            <p className="text-sm font-medium group-hover:underline">
              {data.reporterName}
            </p>
          </div>
        </Link>
      </div>

      {/* Sales Section */}
      <div className="bg-muted/50 space-y-4 rounded-lg p-4">
        <h3 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          Sales
        </h3>

        {/* Total Sales */}
        <div className="flex items-center gap-3">
          <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
            <HugeiconsIcon
              icon={DollarCircleIcon}
              className="text-muted-foreground size-5"
            />
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Total Sales</p>
            <p className="font-semibold">
              {formatPriceWithDollar(data.totalSales / 100)}
            </p>
          </div>
        </div>

        {/* In-store & Online breakdown */}
        <div className="grid gap-4 border-t pt-4 sm:grid-cols-2">
          {/* In-store Sales */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="bg-muted flex h-9 w-9 items-center justify-center rounded-lg">
                <HugeiconsIcon
                  icon={Store01Icon}
                  className="text-muted-foreground size-4"
                />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">In-store Sales</p>
                <p className="font-medium">
                  {formatPriceWithDollar(data.inStoreSales / 100)}
                </p>
              </div>
            </div>
            <div className="text-muted-foreground ml-12 grid grid-cols-2 gap-1 text-xs">
              <span>Card</span>
              <span className="text-right">
                {formatPriceWithDollar(data.cardSales / 100)}
              </span>
              <span>Cash</span>
              <span className="text-right">
                {formatPriceWithDollar(data.cashSales / 100)}
              </span>
            </div>
          </div>

          {/* Online Sales */}
          <div className="space-y-2 border-t pt-4 sm:border-t-0 sm:pt-0 sm:pl-4">
            <div className="flex items-center gap-3">
              <div className="bg-muted flex h-9 w-9 items-center justify-center rounded-lg">
                <HugeiconsIcon
                  icon={SmartPhone01Icon}
                  className="text-muted-foreground size-4"
                />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Online Sales</p>
                <p className="font-medium">
                  {formatPriceWithDollar(data.otherSales / 100)}
                </p>
              </div>
            </div>
            <div className="text-muted-foreground ml-12 grid grid-cols-2 gap-1 text-xs">
              <span>UberEats</span>
              <span className="text-right">
                {formatPriceWithDollar(data.uberEatsSales / 100)}
              </span>
              <span>DoorDash</span>
              <span className="text-right">
                {formatPriceWithDollar(data.doorDashSales / 100)}
              </span>
              <span>Ritual</span>
              <span className="text-right">
                {formatPriceWithDollar(data.onlineSales / 100)}
              </span>
              <span>SkipTheDishes</span>
              <span className="text-right">
                {formatPriceWithDollar(data.skipTheDishesSales / 100)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cash Section */}
      <div className="bg-muted/50 space-y-4 rounded-lg p-4">
        <h3 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          Cash
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Cash Out */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="bg-muted flex h-9 w-9 items-center justify-center rounded-lg">
                <HugeiconsIcon
                  icon={CashIcon}
                  className="text-muted-foreground size-4"
                />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Cash Out</p>
                <p className="font-semibold">
                  {formatPriceWithDollar(data.cashOut / 100)}
                </p>
              </div>
            </div>
            <div className="text-muted-foreground ml-12 grid grid-cols-2 gap-1 text-xs">
              <span>From Till</span>
              <span className="text-right">
                {formatPriceWithDollar(
                  (data.cashInTill - data.startCash) / 100,
                )}
              </span>
              <span>Cash Tips</span>
              <span className="text-right">
                {formatPriceWithDollar(data.cashTips / 100)}
              </span>
            </div>
          </div>

          {/* Cash Difference */}
          <div className="space-y-2 border-t pt-4 sm:border-t-0 sm:pt-0 sm:pl-4">
            <div className="flex items-center gap-3">
              <div className="bg-muted flex h-9 w-9 items-center justify-center rounded-lg">
                <HugeiconsIcon
                  icon={BalanceScaleIcon}
                  className={cn(
                    "size-4",
                    data.cashDifference === 0 && "text-muted-foreground",
                    data.cashDifference < 0 && "text-destructive",
                    data.cashDifference > 0 && "text-green-600",
                  )}
                />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Cash Difference</p>
                <p
                  className={cn(
                    "font-semibold",
                    data.cashDifference < 0 && "text-destructive",
                    data.cashDifference > 0 && "text-green-600",
                  )}
                >
                  {formatPriceWithDollar(data.cashDifference / 100)}
                </p>
              </div>
            </div>
            <div className="text-muted-foreground ml-12 grid grid-cols-2 gap-1 text-xs">
              <span>Cash in Till</span>
              <span className="text-right">
                {formatPriceWithDollar(data.cashInTill / 100)}
              </span>
              <span>Start Cash</span>
              <span className="text-right">
                {formatPriceWithDollar(data.startCash / 100)}
              </span>
              <span>Actual Cash</span>
              <span className="text-right">
                {formatPriceWithDollar(data.actualCash / 100)}
              </span>
            </div>
          </div>
        </div>

        {/* Expenses */}
        {data.expenses > 0 && (
          <div className="flex items-center gap-3 border-t pt-3">
            <div className="bg-muted flex h-9 w-9 items-center justify-center rounded-lg">
              <HugeiconsIcon
                icon={Invoice01Icon}
                className="text-muted-foreground size-4"
              />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Expenses</p>
              <p className="flex items-center font-medium">
                {formatPriceWithDollar(data.expenses / 100)}
                {data.expensesReason && (
                  <span className="text-muted-foreground ml-2 text-xs font-normal">
                    — {data.expensesReason}
                  </span>
                )}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Tips Section */}
      <div className="bg-muted/50 space-y-4 rounded-lg p-4">
        <h3 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          Tips
        </h3>

        {/* Main stats with separator */}
        <div className="grid items-start gap-4 sm:grid-cols-3">
          {/* Total Tips with breakdown */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                <HugeiconsIcon
                  icon={Coins01Icon}
                  className="text-muted-foreground size-5"
                />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Total Tips</p>
                <p className="font-semibold">
                  {formatPriceWithDollar(data.totalTips / 100)}
                </p>
              </div>
            </div>
            <div className="text-muted-foreground ml-13 grid grid-cols-2 gap-1 text-xs">
              <span>Card</span>
              <span className="text-right">
                {formatPriceWithDollar(data.cardTips / 100)}
              </span>
              <span>Cash</span>
              <span className="text-right">
                {formatPriceWithDollar(data.cashTips / 100)}
              </span>
              <span>Extra</span>
              <span className="text-right">
                {formatPriceWithDollar(data.extraTips / 100)}
              </span>
            </div>
          </div>

          {/* Total Hours */}
          <div className="flex items-center gap-3 border-t pt-4 sm:border-t-0 sm:pt-0 sm:pl-4">
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
              <HugeiconsIcon
                icon={UserGroupIcon}
                className="text-muted-foreground size-5"
              />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Total Hours</p>
              <p className="font-semibold">{data.totalHours} hrs</p>
            </div>
          </div>

          {/* Per Hour */}
          <div className="flex items-center gap-3 border-t pt-4 sm:border-t-0 sm:pt-0 sm:pl-4">
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
              <HugeiconsIcon
                icon={DivideSignCircleIcon}
                className="text-muted-foreground size-5"
              />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Per Hour</p>
              <p className="font-semibold">
                {formatPriceWithDollar(data.tipsPerHour / 100)}
              </p>
            </div>
          </div>
        </div>

        {/* Employee Tips */}
        <div className="space-y-3 border-t pt-3">
          <p className="text-muted-foreground text-xs font-medium">
            Employee Breakdown
          </p>

          <div className="grid gap-2 sm:grid-cols-2">
            {data.employees.map((emp) => (
              <div
                key={emp.userId}
                className="bg-muted flex items-center justify-between rounded-lg px-2 py-1.5"
              >
                <Link
                  href={`/profile/${emp.username}`}
                  className="group flex items-center gap-2 transition-opacity hover:opacity-80"
                >
                  <ProfilePicture image={emp.image} size={24} name={emp.name} />
                  <span className="text-xs group-hover:underline">
                    {emp.name}
                  </span>
                </Link>
                <div className="text-right">
                  <p className="text-xs font-semibold">
                    {formatPriceWithDollar((emp.hour * data.tipsPerHour) / 100)}
                  </p>
                  <p className="text-muted-foreground text-xs">{emp.hour}h</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
