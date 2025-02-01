import { GoBackButton } from "@/components/buttons/GoBackButton";
import { Separator } from "@/components/ui/separator";
import { getCurrentSession } from "@/lib/auth/session";
import { hasAccess } from "@/utils/access-control";
import { notFound, redirect } from "next/navigation";
import { ExpensesForm } from "../expenses-form";

export default async function Page() {
  const { session, user } = await getCurrentSession();
  if (!session) redirect("/login");
  if (user.accountStatus !== "active") return notFound();
  if (!hasAccess(user.role, "/admin")) return notFound();

  return (
    <section className="space-y-4">
      <GoBackButton size={"sm"} className="h-7 px-4" />

      <h1>Add expense</h1>

      <Separator />

      <ExpensesForm />
    </section>
  );
}
