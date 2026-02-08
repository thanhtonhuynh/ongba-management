import { FULL_MONTHS, NUM_MONTHS } from "@/app/constants";
import { Container } from "@/components/Container";
import { CurrentTag } from "@/components/CurrentTag";
import { Header } from "@/components/layout";
import { ErrorMessage } from "@/components/Message";
import { Typography } from "@/components/typography";
import { getExpensesByYear } from "@/data-access/expenses";
import { getReportsByDateRange } from "@/data-access/report";
import { getCurrentSession } from "@/lib/auth/session";
import { hasAccess } from "@/utils/access-control";
import { processCashFlowData, processYearCashFlowData } from "@/utils/cashflow";
import {
  getDayRangeByMonthAndYear,
  getDayRangeByYear,
  populateMonthSelectData,
} from "@/utils/hours-tips";
import { authenticatedRateLimit } from "@/utils/rate-limiter";
import moment from "moment-timezone";
import { notFound, redirect } from "next/navigation";
import { Fragment } from "react";
import { CashFlowTable } from "./CashflowTable";
import { MonthSelect } from "./MonthSelect";
import { YearCashFlowTable } from "./year-cash-flow-table";

type SearchParams = Promise<{
  year: string;
  month: string;
}>;

export default async function Page(props: { searchParams: SearchParams }) {
  const { session, user } = await getCurrentSession();
  if (!session) redirect("/login");
  if (user.accountStatus !== "active") return notFound();
  if (!hasAccess(user.role, "/admin")) return notFound();

  if (!(await authenticatedRateLimit(user.id))) {
    return (
      <ErrorMessage message="Too many requests. Please try again later." />
    );
  }

  const searchParams = await props.searchParams;

  const { years } = await populateMonthSelectData();

  const today = moment.tz("America/Vancouver").startOf("day").toDate();
  let selectedYear = today.getFullYear();
  let selectedMonth = today.getMonth();

  if (searchParams.year) {
    const year = parseInt(searchParams.year);

    if (isNaN(year) || !years.includes(year)) {
      return (
        <ErrorMessage
          className="self-start"
          message="Invalid year. No data available for this year."
        />
      );
    }
    selectedYear = year;
  }

  if (searchParams.year && searchParams.month) {
    const month = parseInt(searchParams.month);

    if (isNaN(month) || !NUM_MONTHS.includes(month)) {
      return (
        <ErrorMessage
          className="self-start"
          message="Invalid month. Please check the URL and try again."
        />
      );
    }
    selectedMonth = parseInt(searchParams.month) - 1;
  } else if (searchParams.year && !searchParams.month) {
    selectedMonth = 0;
  }

  const dayRange = getDayRangeByMonthAndYear(selectedYear, selectedMonth);
  const reports = await getReportsByDateRange(dayRange);
  const processedReports = processCashFlowData(reports);

  const yearDayRange = getDayRangeByYear(selectedYear);
  const [yearReports, yearMainExpenses] = await Promise.all([
    getReportsByDateRange(yearDayRange),
    getExpensesByYear(selectedYear),
  ]);
  const yearProcessedReports = processYearCashFlowData(
    yearReports,
    yearMainExpenses,
  );

  return (
    <Fragment>
      <Header>
        <Typography variant="h1">Cash Flow</Typography>
      </Header>

      <Container>
        <div className="flex space-x-4">
          {years.length > 0 && (
            <MonthSelect
              years={years}
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
            />
          )}

          <div className="flex-1 space-y-8 overflow-auto">
            <div className="space-y-4">
              <h2 className="flex items-center gap-2">
                {FULL_MONTHS[selectedMonth]} {selectedYear}
                {selectedYear === today.getFullYear() &&
                  selectedMonth === today.getMonth() && <CurrentTag />}
              </h2>
              <CashFlowTable reports={processedReports} />
            </div>
            <div className="space-y-4">
              <h2>Year {selectedYear} Summary</h2>
              <YearCashFlowTable data={yearProcessedReports} />
            </div>
          </div>
        </div>
      </Container>
    </Fragment>
  );
}
