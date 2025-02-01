import { ErrorMessage } from "@/components/Message";
import { Separator } from "@/components/ui/separator";
import { getEmployees } from "@/data-access/employee";
import { getStartCash } from "@/data-access/store";
import { getCurrentSession } from "@/lib/auth/session";
import { hasAccess } from "@/utils/access-control";
import { authenticatedRateLimit } from "@/utils/rate-limiter";
import { notFound, redirect } from "next/navigation";
import { NewReportPortal } from "./NewReportPortal";

export default async function Page() {
  const { session, user } = await getCurrentSession();
  if (!session) redirect("/login");
  if (user.accountStatus !== "active") return notFound();
  if (!hasAccess(user.role, "/report/new")) return notFound();

  if (!(await authenticatedRateLimit(user.id))) {
    return (
      <ErrorMessage message="Too many requests. Please try again later." />
    );
  }

  const users = await getEmployees("active");
  const startCash = await getStartCash();

  return (
    <section className="flex flex-1 flex-col space-y-4">
      <h1>Create sale report</h1>

      <Separator />

      <NewReportPortal users={users} startCash={startCash} />
    </section>
  );
}
