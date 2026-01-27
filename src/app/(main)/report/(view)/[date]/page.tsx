import { SaleReportCard } from "@/components/SaleReportCard";
import { Button } from "@/components/ui/button";
import { getReportRaw } from "@/data-access/report";
import { getCurrentSession } from "@/lib/auth/session";
import { parseVancouverUrlDate } from "@/lib/utils";
import { hasAccess } from "@/utils/access-control";
import { processReportDataForView } from "@/utils/report";
import { Pencil } from "lucide-react";
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
      <div className="mt-16 flex flex-col items-center gap-2">
        <h2 className="text-destructive text-xl font-semibold">
          Report not found
        </h2>
        <p className="text-muted-foreground">
          No sale report exists for the selected date.
        </p>
      </div>
    );

  const processedReport = processReportDataForView(report);

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

        {hasAccess(user!.role, "/report", "delete") && (
          <div className="bg-destructive/10 mt-8 flex flex-col items-center space-y-4 rounded-lg p-4 shadow">
            <DeleteReportButton reportId={processedReport.id!} />
          </div>
        )}
      </div>
    </Fragment>
  );
}
