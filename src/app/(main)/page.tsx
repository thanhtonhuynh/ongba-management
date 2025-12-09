import { Container } from "@/components/Container";
import { Header } from "@/components/header";
import { ErrorMessage } from "@/components/Message";
import { SaleReportCard } from "@/components/SaleReportCard";
import { Button } from "@/components/ui/button";
import { getReportRaw } from "@/data-access/report";
import { getCurrentSession } from "@/lib/auth/session";
import { SaleReportCardProcessedData } from "@/types";
import { hasAccess } from "@/utils/access-control";
import { authenticatedRateLimit } from "@/utils/rate-limiter";
import { processReportDataForView } from "@/utils/report";
import { CircleCheck, ClipboardPen } from "lucide-react";
import moment from "moment-timezone";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Fragment } from "react";
import { SalesSummary } from "../(admin)/SalesSummary";
import { EmployeeAnalytics } from "./EmployeeAnalytics";

type SearchParams = Promise<{
  year: string;
  month: string;
}>;

export default async function Home(props: { searchParams: SearchParams }) {
  const { session, user } = await getCurrentSession();
  if (!session) redirect("/login");
  if (user.accountStatus !== "active") notFound();

  if (!(await authenticatedRateLimit(user.id))) {
    return (
      <ErrorMessage message="Too many requests. Please try again later." />
    );
  }

  const searchParams = await props.searchParams;

  const today = moment().tz("America/Vancouver").startOf("day").toDate();
  const todayReport = await getReportRaw({ date: today });
  let processedTodayReportData: SaleReportCardProcessedData | undefined;
  if (todayReport) {
    processedTodayReportData = processReportDataForView(todayReport);
  }

  let selectedYear: number, selectedMonth: number;
  if (searchParams.year && searchParams.month) {
    selectedYear = parseInt(searchParams.year);
    selectedMonth = parseInt(searchParams.month);
  } else {
    selectedYear = today.getFullYear();
    selectedMonth = today.getMonth() + 1;
  }

  return (
    <Fragment>
      <Header>
        <div className="text-muted-foreground text-sm font-medium">
          {moment().tz("America/Vancouver").format("dddd, MMMM D, YYYY")}
        </div>
      </Header>

      <Container>
        <section className="space-y-4">
          <div className="space-y-4 rounded-lg border p-6 shadow-sm">
            <div>Good day, {user.name}!</div>

            {todayReport && (
              <div className="bg-muted flex w-fit items-center gap-2 rounded-lg border-l-2 border-l-blue-500 px-2 py-1">
                <CircleCheck size={17} className="text-blue-500" />
                Today's report has been submitted!
              </div>
            )}

            {hasAccess(user.role, "/report", "create") && (
              <>
                <Button className="flex w-fit items-center gap-2" asChild>
                  <Link href={`report/new`}>
                    <ClipboardPen size={16} />
                    Create new sale report
                  </Link>
                </Button>

                <div className="text-muted-foreground text-sm">
                  <span className="font-semibold">Note:</span> There can only be
                  <span className="font-semibold"> ONE </span>
                  sale report per day. Submitting a new report will overwrite
                  the existing one.
                </div>
              </>
            )}
          </div>
        </section>

        {todayReport && (
          <section className="space-y-4 rounded-lg border p-6 shadow-sm">
            <h6>Today's Sale Report</h6>
            <SaleReportCard data={processedTodayReportData} />
          </section>
        )}

        <EmployeeAnalytics user={user} />

        {user.role === "admin" && (
          <SalesSummary year={selectedYear} month={selectedMonth} />
        )}
      </Container>
    </Fragment>
  );
}
