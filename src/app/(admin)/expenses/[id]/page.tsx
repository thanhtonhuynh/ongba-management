import { GoBackButton } from "@/components/buttons/GoBackButton";
import { Container } from "@/components/Container";
import { Header } from "@/components/header";
import { Separator } from "@/components/ui/separator";
import { getExpenseById } from "@/data-access/expenses";
import { getCurrentSession } from "@/lib/auth/session";
import { formatPriceWithDollar } from "@/lib/utils";
import { hasAccess } from "@/utils/access-control";
import { format } from "date-fns";
import { notFound, redirect } from "next/navigation";
import { Fragment } from "react";
import { ExpensesForm } from "../expenses-form";
import { DeleteExpenseButton } from "./delete-expense-button";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const { session, user } = await getCurrentSession();
  if (!session) redirect("/login");
  if (user.accountStatus !== "active") notFound();
  if (!hasAccess(user.role, "/admin")) notFound();

  const params = await props.params;
  const expense = await getExpenseById(params.id);
  if (!expense) notFound();

  const totalSpend = expense.entries.reduce(
    (acc, entry) => acc + entry.amount,
    0,
  );

  return (
    <Fragment>
      <Header>
        <h1>Expense on {format(expense.date, "MMMM d, yyyy")}</h1>
      </Header>

      <Container>
        <GoBackButton size={"sm"} className="h-7 w-fit px-4" />

        <div>
          Total spend:{" "}
          <span className="font-bold">
            {formatPriceWithDollar(totalSpend / 100)}
          </span>
        </div>

        <Separator />

        <div className="my-4 space-y-2">
          <h3 className="font-semibold">Edit details</h3>
          <ExpensesForm expense={expense} />
        </div>

        <Separator />

        <div className="bg-destructive/10 my-4 space-y-4 rounded-md p-4 shadow-sm">
          <h3 className="text-destructive font-semibold">Danger zone</h3>
          <DeleteExpenseButton expense={expense} />
        </div>
      </Container>
    </Fragment>
  );
}
