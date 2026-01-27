import { ProfilePicture } from "@/components/ProfilePicture";
import { SaleReportCard } from "@/components/SaleReportCard";
import { Button } from "@/components/ui/button";
import { getReportRaw } from "@/data-access/report";
import { getCurrentSession } from "@/lib/auth/session";
import { parseVancouverUrlDate } from "@/lib/utils";
import { hasAccess } from "@/utils/access-control";
import { processReportDataForView } from "@/utils/report";
import { Pencil } from "lucide-react";
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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h6>Sales Report</h6>

          {hasAccess(user!.role, "/report", "update") && (
            <Button variant="outline" size={"sm"} asChild>
              <Link href={`/report/edit/${processedReport.id}`}>
                <Pencil className="size-3" />
                Edit
              </Link>
            </Button>
          )}
        </div>

        <SaleReportCard data={processedReport} />

        {auditLogs.length > 0 && (
          <div className="bg-muted/50 space-y-3 rounded-lg p-4">
            <h3 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Audit Log
            </h3>
            <div className="space-y-2 text-sm">
              {auditLogs.map((log) => (
                <p
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
                    <span className="group-hover:underline">{log.name}</span>
                  </Link>
                  on{" "}
                  {moment(log.timestamp)
                    .tz("America/Vancouver")
                    .format("MMM D, YYYY h:mma")}
                </p>
              ))}
            </div>
          </div>
        )}

        {hasAccess(user!.role, "/report", "delete") && (
          <div className="bg-destructive/10 mt-8 flex flex-col items-center space-y-4 rounded-lg p-4 shadow">
            <DeleteReportButton reportId={processedReport.id!} />
          </div>
        )}
      </div>
    </Fragment>
  );
}
