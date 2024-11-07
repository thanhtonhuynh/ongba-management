import { ErrorMessage } from "@/components/Message";
import { Separator } from "@/components/ui/separator";
import { getCurrentSession } from "@/lib/auth/session";
import { hasAccess } from "@/utils/access-control";
import { authenticatedRateLimit } from "@/utils/rate-limiter";
import { notFound, redirect } from "next/navigation";
import { SalesSummary } from "./SalesSummary";

export default async function Page() {
  const { session, user } = await getCurrentSession();
  if (!session) redirect("/login");
  if (user.accountStatus !== "active") return notFound();
  if (!hasAccess(user.role, "/admin")) return notFound();

  if (!(await authenticatedRateLimit(user.id))) {
    return (
      <ErrorMessage message="Too many requests. Please try again later." />
    );
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <Separator />

      <SalesSummary />
    </section>
  );
}
