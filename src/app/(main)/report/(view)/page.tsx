import { SaleReportCard } from "@/app/(main)/report/_components/sales-report-card";
import { Typography } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ICONS } from "@/constants/icons";
import { PERMISSIONS } from "@/constants/permissions";
import { getReportRaw } from "@/data-access/report";
import { getCurrentSession } from "@/lib/auth/session";
import { parseVancouverUrlDate } from "@/lib/utils";
import { hasPermission } from "@/utils/access-control";
import { processReportDataForView } from "@/utils/report";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { DeleteReportModal, ReportAuditLog } from "./_components";

type SearchParams = Promise<{
  date: string;
}>;

export default async function Page(props: { searchParams: SearchParams }) {
  const { user } = await getCurrentSession();
  if (!user) redirect("/login");
  if (user.accountStatus !== "active") return notFound();

  const searchParams = await props.searchParams;
  const date = parseVancouverUrlDate(searchParams.date);
  if (!date) return null;

  const report = await getReportRaw({ date });
  if (!report)
    return (
      <Card className="mt-9">
        <CardContent className="space-y-3 text-center">
          <Typography variant="h2" className="text-error">
            Report not found
          </Typography>
          <Typography variant="p-sm">No sales report exists for the selected date</Typography>
        </CardContent>
      </Card>
    );

  const processedReport = processReportDataForView(report);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Sales Report</CardTitle>

        <div className="flex items-center gap-3">
          {hasPermission(user.role, PERMISSIONS.REPORTS_UPDATE) && (
            <Button
              nativeButton={false}
              variant="outline-accent"
              size={"sm"}
              render={
                <Link href={`/report/edit/${processedReport.id}`}>
                  <HugeiconsIcon icon={ICONS.EDIT} />
                  Edit
                </Link>
              }
            />
          )}
          {hasPermission(user.role, PERMISSIONS.REPORTS_DELETE) && (
            <DeleteReportModal reportId={processedReport.id!} date={processedReport.date} />
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <SaleReportCard data={processedReport} />

        <ReportAuditLog auditLogs={processedReport.auditLogs} />
      </CardContent>
    </Card>
  );
}
