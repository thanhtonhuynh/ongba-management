import { getCurrentSession } from "@/lib/auth/session";
import { hasAccess } from "@/utils/access-control";
import { notFound, redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import {
  getDayRangeByMonthAndYear,
  populateMonthSelectData,
} from "@/utils/hours-tips";
import { MonthSelect } from "./MonthSelect";
import { FULL_MONTHS, NUM_MONTHS } from "@/app/constants";
import { ErrorMessage } from "@/components/Message";
import moment from "moment-timezone";
import { getReportsByDateRange } from "@/data-access/report";
import { CashFlowTable } from "./CashflowTable";
import { processCashFlowData } from "@/utils/cashflow";
import { authenticatedRateLimit } from "@/utils/rate-limiter";
import { CurrentTag } from "@/components/CurrentTag";

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

  const { years, firstYearMonths, latestYearMonths } =
    await populateMonthSelectData();

  if (searchParams.year && searchParams.month) {
    const year = parseInt(searchParams.year);
    const month = parseInt(searchParams.month);

    if (
      isNaN(year) ||
      isNaN(month) ||
      !years.includes(year) ||
      !NUM_MONTHS.includes(month) ||
      (year === years[0] && !latestYearMonths.includes(month - 1)) ||
      (year === years[years.length - 1] && !firstYearMonths.includes(month - 1))
    ) {
      return (
        <ErrorMessage
          className="self-start"
          message="Invalid year or month. Please check the URL and try again."
        />
      );
    }
  }

  const today = moment().tz("America/Vancouver").startOf("day").toDate();
  const selectedYear = parseInt(searchParams.year) || today.getFullYear();
  const selectedMonth = parseInt(searchParams.month) || today.getMonth() + 1;

  const dateRange = getDayRangeByMonthAndYear(selectedYear, selectedMonth - 1);
  const reports = await getReportsByDateRange(dateRange);
  const processedReports = processCashFlowData(reports);

  return (
    <section className="space-y-4">
      <h1>Cashflow</h1>

      <Separator className="my-4" />

      <div className="flex space-x-4">
        {years.length > 0 && (
          <MonthSelect
            years={years}
            firstYearMonths={firstYearMonths}
            latestYearMonths={latestYearMonths}
          />
        )}

        <div className="flex-1 space-y-4 overflow-auto">
          <h2 className="flex items-center gap-2">
            {FULL_MONTHS[selectedMonth - 1]} {selectedYear}
            {selectedYear === today.getFullYear() &&
              selectedMonth === today.getMonth() + 1 && <CurrentTag />}
          </h2>

          <CashFlowTable reports={processedReports} />
        </div>
      </div>
    </section>
  );
}
