import { CashCounter } from "@/app/(main)/cash-counter/CashCounter";
import { Separator } from "@/components/ui/separator";
import { getCurrentSession } from "@/lib/auth/session";
import { notFound, redirect } from "next/navigation";

export default async function Page() {
  const { session, user } = await getCurrentSession();
  if (!session) redirect("/login");
  if (user.accountStatus !== "active") return notFound();

  return (
    <section className="space-y-4">
      <h1>Cash Counter</h1>

      <Separator />

      <CashCounter />
    </section>
  );
}
