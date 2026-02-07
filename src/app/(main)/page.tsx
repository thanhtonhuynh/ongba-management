import { Container } from "@/components/Container";
import { Header } from "@/components/layout";
import { ErrorMessage } from "@/components/Message";
import { SaleReportCard } from "@/components/SaleReportCard";
import { Button } from "@/components/ui/button";
import { getReportRaw } from "@/data-access/report";
import { getCurrentSession } from "@/lib/auth/session";
import { SaleReportCardProcessedData } from "@/types";
import { hasAccess } from "@/utils/access-control";
import { authenticatedRateLimit } from "@/utils/rate-limiter";
import { processReportDataForView } from "@/utils/report";
import { UserAccountIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calculator, CalendarCheck, ClipboardPen } from "lucide-react";
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
  const { user } = await getCurrentSession();
  if (!user) redirect("/login");
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
        <div className="text-sm font-medium">
          {moment().tz("America/Vancouver").format("dddd, MMMM D, YYYY")}
        </div>
      </Header>

      <Container>
        {/* Greetings */}
        <section className="bg-background space-y-4 rounded-xl border border-blue-950 p-6">
          <h6>Good day, {user.name}!</h6>

          <div className="p-3">
            <h3 className="text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase">
              Quick Actions
            </h3>

            <div className="flex flex-col items-start gap-1">
              {!todayReport && hasAccess(user.role, "/report", "create") && (
                <Button
                  nativeButton={false}
                  size="sm"
                  variant={"link"}
                  className="text-foreground border-0 p-0"
                  render={
                    <Link href={`report/new`}>
                      <ClipboardPen size={16} />
                      Create report
                    </Link>
                  }
                />
              )}
              <Button
                nativeButton={false}
                variant="link"
                size="sm"
                className="text-foreground border-0 p-0"
                render={
                  <Link href="/cash-counter">
                    <Calculator size={16} />
                    Cash counter
                  </Link>
                }
              />

              <Button
                nativeButton={false}
                variant="link"
                size="sm"
                className="text-foreground border-0 p-0"
                render={
                  <Link href="/my-shifts">
                    <CalendarCheck size={16} />
                    My shifts
                  </Link>
                }
              />
              <Button
                nativeButton={false}
                variant="link"
                size="sm"
                className="text-foreground border-0 p-0"
                render={
                  <Link href={`/profile/${user.username}`}>
                    <HugeiconsIcon icon={UserAccountIcon} className="size-4" />
                    My profile
                  </Link>
                }
              />
            </div>
          </div>
        </section>

        {todayReport && (
          <>
            <section className="bg-background space-y-4 rounded-xl border border-blue-950 p-6">
              <h6>Today's Sales Report</h6>
              <SaleReportCard data={processedTodayReportData} />
            </section>
          </>
        )}

        <EmployeeAnalytics user={user} />

        {user.role === "admin" && (
          <SalesSummary year={selectedYear} month={selectedMonth} />
        )}
      </Container>
    </Fragment>
  );
}
