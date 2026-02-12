"use client";

import { getPlatformById, type Platform } from "@/constants/platforms";
import { cn, formatMoney } from "@/lib/utils";
import { SaleReportCardProcessedData } from "@/types";
import { getPlatformAmount } from "@/utils/report";
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

  const platformData: Platform[] = data.platformSales
    .map((ps) => getPlatformById(ps.platformId))
    .filter(Boolean) as Platform[];

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
              {formatMoney(data.totalSales / 100)}
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
                  {formatMoney(data.inStoreSales / 100)}
                </p>
              </div>
            </div>
            <div className="text-muted-foreground ml-12 grid grid-cols-2 gap-1 text-xs">
              <span>Card</span>
              <span className="text-right">
                {formatMoney(data.cardSales / 100)}
              </span>
              <span>Cash</span>
              <span className="text-right">
                {formatMoney(data.cashSales / 100)}
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
                  {formatMoney(data.onlineSales / 100)}
                </p>
              </div>
            </div>
            <div className="text-muted-foreground ml-12 grid grid-cols-2 gap-1 text-xs">
              {platformData.map((platform) => (
                <PlatformRow
                  key={platform.id}
                  label={platform.label}
                  amount={getPlatformAmount(data.platformSales, platform.id)}
                />
              ))}
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
                  {formatMoney(data.cashOut / 100)}
                </p>
              </div>
            </div>
            <div className="text-muted-foreground ml-12 grid grid-cols-2 gap-1 text-xs">
              <span>From Till</span>
              <span className="text-right">
                {formatMoney((data.cashInTill - data.startCash) / 100)}
              </span>
              <span>Cash Tips</span>
              <span className="text-right">
                {formatMoney(data.cashTips / 100)}
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
                  {formatMoney(data.cashDifference / 100)}
                </p>
              </div>
            </div>
            <div className="text-muted-foreground ml-12 grid grid-cols-2 gap-1 text-xs">
              <span>Cash in Till</span>
              <span className="text-right">
                {formatMoney(data.cashInTill / 100)}
              </span>
              <span>Start Cash</span>
              <span className="text-right">
                {formatMoney(data.startCash / 100)}
              </span>
              <span>Actual Cash</span>
              <span className="text-right">
                {formatMoney(data.actualCash / 100)}
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
                {formatMoney(data.expenses / 100)}
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
                  {formatMoney(data.totalTips / 100)}
                </p>
              </div>
            </div>
            <div className="text-muted-foreground ml-13 grid grid-cols-2 gap-1 text-xs">
              <span>Card</span>
              <span className="text-right">
                {formatMoney(data.cardTips / 100)}
              </span>
              <span>Cash</span>
              <span className="text-right">
                {formatMoney(data.cashTips / 100)}
              </span>
              <span>Extra</span>
              <span className="text-right">
                {formatMoney(data.extraTips / 100)}
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
                {formatMoney(data.tipsPerHour / 100)}
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
                    {formatMoney((emp.hour * data.tipsPerHour) / 100)}
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

function PlatformRow({ label, amount }: { label: string; amount: number }) {
  return (
    <>
      <span>{label}</span>
      <span className="text-right">{formatMoney(amount / 100)}</span>
    </>
  );
}
