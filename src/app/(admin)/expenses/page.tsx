import { FULL_MONTHS } from "@/app/constants";
import { Container } from "@/components/Container";
import { Header } from "@/components/header";
import { ErrorMessage } from "@/components/Message";
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
        <h1>Expenses</h1>
      </Header>

      <Container>
        <Button asChild>
          <Link href="/expenses/new">Add expense</Link>
        </Button>

        <div className="space-y-4">
          <h3 className="font-semibold">Pick a year</h3>
          <YearSelector years={years} selectedYear={selectedYear} />
          <h3 className="font-semibold">Currently viewing: {selectedYear}</h3>
          <ExpensesTable monthlyExpenses={monthlyExpenses} />
        </div>

        <div className="mt-8 space-y-4">
          {monthlyExpenses.map((monthlyExpense) => (
            <Accordion type="single" collapsible key={monthlyExpense.month}>
              <AccordionItem
                value="item-1"
                className="rounded-md border px-4 shadow-sm"
              >
                <AccordionTrigger>
                  {FULL_MONTHS[monthlyExpense.month]}
                </AccordionTrigger>
                <AccordionContent>
                  {monthlyExpense.monthExpenses.map((dayExpense) => (
                    <Link
                      key={dayExpense.id}
                      className="hover:bg-muted/50 flex gap-4 border-b px-4 py-2 text-sm"
                      href={`/expenses/${dayExpense.id}`}
                    >
                      <p className="w-5">
                        {moment(dayExpense.date).format("D")}
                      </p>
                      <div className="flex-1">
                        {dayExpense.entries.map((entry, index) => (
                          <div
                            key={index}
                            className="flex justify-between gap-2"
                          >
                            <p className="line-clamp-1">{entry.reason}</p>
                            <p>{formatPriceWithDollar(entry.amount / 100)}</p>
                          </div>
                        ))}
                      </div>
                      <ChevronRight className="text-muted-foreground size-4 self-center" />
                    </Link>
                  ))}
                  <div className="bg-muted flex justify-between px-4 py-2 text-sm font-bold">
                    <p>Total spent</p>
                    <p>
                      {formatPriceWithDollar(
                        monthlyExpense.totalExpenses / 100,
                      )}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
      </Container>
    </Fragment>
  );
}
