import { ProfilePicture } from "@/components/ProfilePicture";
import { SaleReportCard } from "@/components/SaleReportCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getReportRaw } from "@/data-access/report";
import { getCurrentSession } from "@/lib/auth/session";
import { parseVancouverUrlDate } from "@/lib/utils";
import { hasAccess } from "@/utils/access-control";
import { processReportDataForView } from "@/utils/report";
import { PencilEdit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import moment from "moment-timezone";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Fragment } from "react";
import { DeleteReportButton } from "../../delete-report-button";

type Params = Promise<{ date: string }>;

export default async function Page(props: { params: Params }) {
  const { user } = await getCurrentSession();
  if (!user) redirect("/login");
  if (user.accountStatus !== "active") return notFound();

  const params = await props.params;
  const date = parseVancouverUrlDate(params.date);
  if (!date) return notFound();

  const report = await getReportRaw({ date });
  if (!report)
    return (
      <div className="bg-muted/50 mt-8 flex flex-col items-center gap-2 rounded-lg p-4">
        <h2 className="text-destructive text-base font-semibold uppercase">
          Report not found
        </h2>
        <p className="text-muted-foreground text-sm">
          No sales report exists for the selected date
        </p>
      </div>
    );

  const processedReport = processReportDataForView(report);
  const auditLogs = [...(processedReport.auditLogs ?? [])].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
  );

  return (
    <Fragment>
      <div className="space-y-3">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Sales Report</CardTitle>

            <div className="flex items-center gap-3">
              {hasAccess(user!.role, "/report", "update") && (
                <Button
                  nativeButton={false}
                  variant="outline"
                  size={"sm"}
                  render={
                    <Link href={`/report/edit/${processedReport.id}`}>
                      <HugeiconsIcon icon={PencilEdit02Icon} />
                      Edit
                    </Link>
                  }
                />
              )}
              {hasAccess(user!.role, "/report", "delete") && (
                <DeleteReportButton reportId={processedReport.id!} />
              )}
            </div>
          </CardHeader>

          <CardContent>
            <SaleReportCard data={processedReport} />

            {auditLogs.length > 0 && (
              <div className="bg-muted/50 space-y-3 rounded-lg p-4">
                <h3 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  Audit Log
                </h3>
                <div className="space-y-2 text-sm">
                  {auditLogs.map((log) => (
                    <div
                      key={`${log.userId}-${log.timestamp.toISOString()}`}
                      className="flex items-center gap-2"
                    >
                      Edited by{" "}
                      <Link
                        href={`/profile/${log.username}`}
                        className="group inline-flex items-center gap-2 transition-opacity hover:opacity-80"
                      >
                        <ProfilePicture
                          image={log.image}
                          size={24}
                          name={log.name}
                        />
                        <span className="group-hover:underline">
                          {log.name}
                        </span>
                      </Link>
                      on{" "}
                      {moment(log.timestamp)
                        .tz("America/Vancouver")
                        .format("MMM D, YYYY h:mma")}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Fragment>
  );
}
