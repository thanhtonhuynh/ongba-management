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
  const employees = createReportForm.watch("employees").map((emp) => ({
    userId: emp.userId,
    fullDay: emp.fullDay,
    name: users.find((user) => user.id === emp.userId)?.name || "",
  }));

  return (
    <SaleReportView
      report={createReportForm.watch()}
      employees={employees}
      // users={users}
    />
  );
}
