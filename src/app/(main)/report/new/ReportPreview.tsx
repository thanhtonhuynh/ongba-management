"use client";

import { SaleReportView } from "@/components/SaleReportView";
import { User } from "@/lib/auth/session";
import { CreateReportSchemaTypes } from "@/lib/report/validation";
import { UseFormReturn } from "react-hook-form";

type ReportPreviewProps = {
  createReportForm: UseFormReturn<CreateReportSchemaTypes>;
  users: User[];
};

export function ReportPreview({ createReportForm, users }: ReportPreviewProps) {
  return (
    <SaleReportView
      report={createReportForm.watch()}
      employees={createReportForm.watch("employees")}
      users={users}
    />
  );
}
