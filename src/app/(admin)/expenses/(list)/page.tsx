import { FULL_MONTHS, NUM_MONTHS } from "@/app/constants";
import { NotiMessage } from "@/components/noti-message";
import { CurrentBadge, Typography } from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getExpensesByYear } from "@/data-access/expenses";
import { getCurrentSession } from "@/lib/auth/session";
import { formatMoney } from "@/lib/utils";
import { hasAccess } from "@/utils/access-control";
import { getTodayStartOfDay } from "@/utils/datetime";
import { reshapeExpenses } from "@/utils/expenses";
import { populateMonthSelectData } from "@/utils/hours-tips";
import { authenticatedRateLimit } from "@/utils/rate-limiter";
import { PencilEdit01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ExpensesTable } from "./_components";

type SearchParams = Promise<{
  year?: string;
  month?: string;
}>;

export default async function Page(props: { searchParams: SearchParams }) {
  const { session, user } = await getCurrentSession();
  if (!session) redirect("/login");
  if (user.accountStatus !== "active") return notFound();
  if (!hasAccess(user.role, "/admin")) return notFound();

  if (!(await authenticatedRateLimit(user.id))) {
    return <NotiMessage variant="error" message="Too many requests. Please try again later." />;
  }

  const searchParams = await props.searchParams;
  const { years } = await populateMonthSelectData();

  const today = getTodayStartOfDay();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  if (!searchParams.year) {
    redirect(`/expenses?year=${currentYear}&month=${currentMonth + 1}`);
  }

  const selectedYear = parseInt(searchParams.year);

  if (isNaN(selectedYear) || !years.includes(selectedYear)) {
    return (
      <NotiMessage variant="error" message="Invalid year. Please check the URL and try again." />
    );
  }

  const selectedMonthParam = searchParams.month;
  const selectedMonth = selectedMonthParam ? parseInt(selectedMonthParam) - 1 : currentMonth;

  if (selectedMonthParam && (isNaN(selectedMonth) || !NUM_MONTHS.includes(selectedMonth + 1))) {
    return (
      <NotiMessage variant="error" message="Invalid month. Please check the URL and try again." />
    );
  }

  if (!selectedMonthParam) {
    redirect(`/expenses?year=${selectedYear}&month=${selectedMonth + 1}`);
  }

  const expenses = await getExpensesByYear(selectedYear);
  const monthlyExpenses = reshapeExpenses(expenses);

  const selectedMonthData = monthlyExpenses[selectedMonth];
  const isCurrent = selectedYear === currentYear && selectedMonth === currentMonth;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Year {selectedYear} Summary</CardTitle>
        </CardHeader>

        <CardContent>
          <ExpensesTable monthlyExpenses={monthlyExpenses} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Expenses in {FULL_MONTHS[selectedMonth]} {selectedYear}
            {isCurrent && <CurrentBadge />}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 [&_a]:no-underline">
          {selectedMonthData.monthExpenses.length > 0 ? (
            <>
              <div className="space-y-3">
                {selectedMonthData.monthExpenses.map((dayExpense) => (
                  <Link
                    key={dayExpense.id}
                    className="hover:bg-accent group flex items-start gap-4 rounded-xl border border-transparent px-4 py-2 transition-all duration-300 hover:border-blue-200"
                    href={`/expenses/${dayExpense.id}`}
                  >
                    <Typography variant="h3" className="w-4">
                      {dayExpense.date.getDate()}
                    </Typography>

                    <Typography className="flex-1 text-xs">
                      {dayExpense.entries.map((entry, index) => (
                        <div key={index} className="flex justify-between gap-3">
                          <span className="line-clamp-1">{entry.reason}</span>
                          <span className="font-medium">{formatMoney(entry.amount / 100)}</span>
                        </div>
                      ))}
                    </Typography>

                    <HugeiconsIcon
                      icon={PencilEdit01Icon}
                      className="group-hover:text-primary size-4 self-center transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
                    />
                  </Link>
                ))}
              </div>

              <Typography
                variant="caption"
                className="bg-accent text-accent-foreground flex items-center justify-between rounded-xl px-6 py-3"
              >
                <span>
                  Total spent in {FULL_MONTHS[selectedMonth]} {selectedYear}
                </span>
                <span>{formatMoney(selectedMonthData.totalExpenses / 100)}</span>
              </Typography>
            </>
          ) : (
            <Typography variant="caption" className="mb-3 text-center font-medium">
              No expenses recorded for {FULL_MONTHS[selectedMonth]} {selectedYear}.
            </Typography>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
