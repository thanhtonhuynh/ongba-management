import { ErrorMessage } from "@/components/Message";
import { Separator } from "@/components/ui/separator";
import { getCurrentSession } from "@/lib/auth/session";
import { hasAccess } from "@/utils/access-control";
import { authenticatedRateLimit } from "@/utils/rate-limiter";
import { notFound, redirect } from "next/navigation";

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
      <div>
        <h1 className="text-xl font-semibold">Dashboard</h1>
      </div>

      <Separator className="my-4" />

      <div className="italic">Work in progress...</div>
    </section>
  );
}
