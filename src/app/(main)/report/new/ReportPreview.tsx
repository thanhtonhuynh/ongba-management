"use client";

import { SaleReportCard } from "@/components/SaleReportCard";
import { useSession } from "@/contexts/SessionProvider";
import { CreateReportSchemaInput } from "@/lib/validations/report";
import { SaleReportCardRawData } from "@/types";
import { processReportDataForView } from "@/utils/report";
import { UseFormReturn } from "react-hook-form";

type ReportPreviewProps = {
  createReportForm: UseFormReturn<CreateReportSchemaInput>;
  startCash: number;
};

export function ReportPreview({
  createReportForm,
  startCash,
}: ReportPreviewProps) {
  const { user } = useSession();
  const rawData: SaleReportCardRawData = {
    ...createReportForm.watch(),
    startCash,
    date: new Date(),
    reporterName: user?.name || "Unknown user",
    reporterImage: user?.image || null,
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
