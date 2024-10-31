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
  const processedData = processReportDataForView(rawData);

  return <SaleReportCard data={processedData} />;
}
