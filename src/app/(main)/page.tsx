import { Container } from "@/components/Container";
import { Header } from "@/components/header";
import { ErrorMessage } from "@/components/Message";
import { SaleReportCard } from "@/components/SaleReportCard";
import { Button } from "@/components/ui/button";
import { getReportByDate } from "@/data-access/report";
import { getCurrentSession } from "@/lib/auth/session";
import { SaleReportCardProcessedData, SaleReportCardRawData } from "@/types";
import { hasAccess } from "@/utils/access-control";
import { populateMonthSelectData } from "@/utils/hours-tips";
import { authenticatedRateLimit } from "@/utils/rate-limiter";
import { processReportDataForView } from "@/utils/report";
import { CircleCheck, ClipboardPen } from "lucide-react";
import moment from "moment-timezone";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Fragment } from "react";
import { SalesSummary } from "../(admin)/SalesSummary";
import { NUM_MONTHS } from "../constants";
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
  const { years } = await populateMonthSelectData();

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

  let selectedYear: number;
  let selectedMonth: number;
  if (searchParams.year && searchParams.month) {
    selectedYear = parseInt(searchParams.year);
    selectedMonth = parseInt(searchParams.month);

    if (
      isNaN(selectedYear) ||
      isNaN(selectedMonth) ||
      !years.includes(selectedYear) ||
      !NUM_MONTHS.includes(selectedMonth)
    ) {
      return (
        <ErrorMessage
          className="self-start"
          message="Invalid year or month. Please check the URL and try again."
        />
      );
    }
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
          <div className="space-y-4 rounded-md border p-4 shadow-sm">
            <div>Good day, {user.name}!</div>

            {todayReport && (
              <div className="bg-muted flex w-fit items-center gap-2 rounded border-l-2 border-l-blue-500 px-2 py-1 font-medium">
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
          <section className="space-y-4 rounded-md border p-4 shadow-sm">
            <h1 className="text-xl">Today's Sale Report</h1>
            <SaleReportCard data={processedTodayReportData} />
          </section>
        )}

        <EmployeeAnalytics user={user} />

        <SalesSummary year={selectedYear} month={selectedMonth} />
      </Container>
    </Fragment>
  );
}
