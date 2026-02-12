import { FULL_MONTHS } from "@/app/constants";
import { Container } from "@/components/Container";
import { Header } from "@/components/layout";
import { ErrorMessage } from "@/components/message";
import { Typography } from "@/components/typography";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { getExpensesByYear } from "@/data-access/expenses";
import { getCurrentSession } from "@/lib/auth/session";
import { formatPriceWithDollar } from "@/lib/utils";
import { hasAccess } from "@/utils/access-control";
import { reshapeExpenses } from "@/utils/expenses";
import { populateMonthSelectData } from "@/utils/hours-tips";
import { authenticatedRateLimit } from "@/utils/rate-limiter";
import { ChevronRight } from "lucide-react";
import moment from "moment-timezone";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Fragment } from "react";
import { ExpensesTable } from "./expenses-table";
import { YearSelector } from "./year-selector";

type SearchParams = Promise<{
  year: string;
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

  if (searchParams.year) {
    const year = parseInt(searchParams.year);

    if (isNaN(year) || !years.includes(year)) {
      return (
        <ErrorMessage
          className="self-start"
          message="Invalid year. Please check the URL and try again."
        />
      );
    }
  }

  const today = moment.tz("America/Vancouver").startOf("day").toDate();
  const selectedYear = parseInt(searchParams.year) || today.getFullYear();

  const expenses = await getExpensesByYear(selectedYear);
  const monthlyExpenses = reshapeExpenses(expenses);

  return (
    <Fragment>
      <Header>
        <div className="flex flex-1 items-center justify-between">
          <Typography variant="h1">Expenses</Typography>
          <Button
            nativeButton={false}
            variant={"outline"}
            render={<Link href="/expenses/new">Add expense</Link>}
          />
        </div>
      </Header>

      <Container>
        <div className="space-y-3">
          <YearSelector years={years} selectedYear={selectedYear} />
          <ExpensesTable monthlyExpenses={monthlyExpenses} />
        </div>

        <div>
          <Accordion multiple>
            {monthlyExpenses.map((monthlyExpense) => (
              <AccordionItem
                key={monthlyExpense.month}
                value={`month-${monthlyExpense.month}`}
              >
                <AccordionTrigger>
                  {FULL_MONTHS[monthlyExpense.month]}
                </AccordionTrigger>

                <AccordionContent className={"space-y-2 [&_a]:no-underline"}>
                  {monthlyExpense.monthExpenses.map((dayExpense) => (
                    <Link
                      key={dayExpense.id}
                      className="hover:bg-muted group hover:border-border flex items-start gap-4 rounded-lg border border-transparent px-4 py-2 text-xs transition-all duration-300"
                      href={`/expenses/${dayExpense.id}`}
                    >
                      <span className="w-4">
                        {moment(dayExpense.date).format("D")}
                      </span>

                      <div className="flex-1">
                        {dayExpense.entries.map((entry, index) => (
                          <div
                            key={index}
                            className="flex justify-between gap-2"
                          >
                            <span className="line-clamp-1">{entry.reason}</span>
                            <span>
                              {formatPriceWithDollar(entry.amount / 100)}
                            </span>
                          </div>
                        ))}
                      </div>
                      <ChevronRight className="text-muted-foreground size-4 self-center transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  ))}

                  <div className="flex items-center justify-between rounded-lg border p-3 text-xs font-bold">
                    <span>Total spent</span>
                    <span>
                      {formatPriceWithDollar(
                        monthlyExpense.totalExpenses / 100,
                      )}
                    </span>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Container>
    </Fragment>
  );
}
