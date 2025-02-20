import { ErrorMessage } from "@/components/Message";
import { SaleReportCard } from "@/components/SaleReportCard";
import { Button } from "@/components/ui/button";
import { getReportByDate } from "@/data-access/report";
import { getCurrentSession } from "@/lib/auth/session";
import { SaleReportCardProcessedData, SaleReportCardRawData } from "@/types";
import { hasAccess } from "@/utils/access-control";
import { authenticatedRateLimit } from "@/utils/rate-limiter";
import { processReportDataForView } from "@/utils/report";
import { CircleCheck, ClipboardPen } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { EmployeeAnalytics } from "./EmployeeAnalytics";

export default async function Home() {
  const { session, user } = await getCurrentSession();
  if (!session) redirect("/login");
  if (user.accountStatus !== "active") return notFound();

  if (!(await authenticatedRateLimit(user.id))) {
    return (
      <ErrorMessage message="Too many requests. Please try again later." />
    );
  }

  const today = moment().tz("America/Vancouver").startOf("day").toDate();
  const todayReport = await getReportByDate(today);
  let processedTodayReportData: SaleReportCardProcessedData | undefined;
  if (todayReport) {
    const employees = todayReport.employeeShifts.map((data) => ({
      userId: data.userId,
      hour: data.hours,
      name: data.user.name,
      image: data.user.image || undefined,
    }));

    const rawData: SaleReportCardRawData = {
      reporterName: todayReport.reporter.name,
      reporterImage: todayReport.reporter.image,
      employees,
      ...todayReport,
    };

    processedTodayReportData = processReportDataForView(rawData);
  }

  return (
    <section className="space-y-4">
      <div className="text-sm font-medium text-muted-foreground">
        {moment().tz("America/Vancouver").format("dddd, MMMM D, YYYY")}
      </div>

      <div className="space-y-4 rounded-md border p-4 shadow">
        <div>Good day, {user.name}!</div>

        {todayReport && (
          <div className="flex w-fit items-center gap-2 rounded border-l-2 border-l-blue-500 bg-muted px-2 py-1 font-medium">
            <CircleCheck size={17} className="text-blue-500" />
            Today's report has been submitted!
          </div>
        )}

        {hasAccess(user.role, "/report/new") && (
          <>
            <Button className="flex w-fit items-center gap-2" asChild>
              <Link href={`report/new`}>
                <ClipboardPen size={16} />
                Create new sale report
              </Link>
            </Button>

            <div className="text-sm text-muted-foreground">
              <span className="font-semibold">Note:</span> There can only be
              <span className="font-semibold"> ONE </span>
              sale report per day. Submitting a new report will overwrite the
              existing one.
            </div>
          </>
        )}
      </div>

      {todayReport && (
        <div className="space-y-4 rounded-md border p-4 shadow">
          <h1 className="text-xl">Today's Sale Report</h1>
          <SaleReportCard data={processedTodayReportData} />
        </div>
      )}

      <EmployeeAnalytics user={user} />
    </section>
  );
}
