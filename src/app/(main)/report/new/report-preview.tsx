"use client";

import { SaleReportCard } from "@/components/SaleReportCard";
import { useSession } from "@/contexts/SessionProvider";
import { SaleReportInputs } from "@/lib/validations/report";
import { SaleReportCardRawData } from "@/types";
import { processReportDataForView } from "@/utils/report";
import { use } from "react";
import { UseFormReturn } from "react-hook-form";

type Props = {
  saleReportForm: UseFormReturn<SaleReportInputs>;
  startCashPromise: Promise<number>;
  reporterName?: string;
  reporterImage?: string | null;
  reporterUsername?: string;
};

export function ReportPreview({
  saleReportForm,
  startCashPromise,
  reporterName,
  reporterImage,
  reporterUsername,
}: Props) {
  const { user } = useSession();
  const startCash = use(startCashPromise);

  const rawData: SaleReportCardRawData = {
    ...saleReportForm.watch(),
    startCash,
    reporterName: reporterName ?? user?.name ?? "Unknown user",
    reporterImage: reporterImage ?? user?.image ?? null,
    reporterUsername: reporterUsername ?? user?.username ?? "unknown",
  };

  const rawDataInCents = {
    ...rawData,
    totalSales: rawData.totalSales * 100,
    cardSales: rawData.cardSales * 100,
    uberEatsSales: rawData.uberEatsSales * 100,
    doorDashSales: rawData.doorDashSales * 100,
    skipTheDishesSales: rawData.skipTheDishesSales * 100,
    onlineSales: rawData.onlineSales * 100,
    expenses: rawData.expenses * 100,
    cashInTill: rawData.cashInTill * 100,
    cardTips: rawData.cardTips * 100,
    cashTips: rawData.cashTips * 100,
    extraTips: rawData.extraTips * 100,
  };

  const processedData = processReportDataForView(rawDataInCents);

  return <SaleReportCard data={processedData} />;
}
