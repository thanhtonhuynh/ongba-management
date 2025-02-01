import { GoBackButton } from "@/components/buttons/GoBackButton";
import { Separator } from "@/components/ui/separator";
import { getExpenseById } from "@/data-access/expenses";
import { getCurrentSession } from "@/lib/auth/session";
import { formatPriceWithDollar } from "@/lib/utils";
import { hasAccess } from "@/utils/access-control";
import { format } from "date-fns";
import { notFound, redirect } from "next/navigation";
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
    <section className="flex flex-col gap-4">
      <GoBackButton size={"sm"} className="h-7 w-fit px-4" />

      <h1>Expense on {format(expense.date, "MMMM d, yyyy")}</h1>

      <div>
        Total spend:{" "}
        <span className="font-bold">{formatPriceWithDollar(totalSpend)}</span>
      </div>

      <Separator />

      <div className="my-4 space-y-2">
        <h3 className="font-semibold">Edit details</h3>
        <ExpensesForm expense={expense} />
      </div>

      <Separator />

      <div className="my-4 space-y-4 rounded-md bg-destructive/10 p-4 shadow">
        <h3 className="font-semibold text-destructive">Danger zone</h3>
        <DeleteExpenseButton expense={expense} />
      </div>
    </section>
  );
}
