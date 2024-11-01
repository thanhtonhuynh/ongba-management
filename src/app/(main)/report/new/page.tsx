import { getCurrentSession } from "@/lib/auth/session";
import { notFound, redirect } from "next/navigation";
import { NewReportPortal } from "./NewReportPortal";
import { getStartCash } from "@/data-access/store";
import { hasAccess } from "@/utils/access-control";
import { getEmployees } from "@/data-access/employee";
import { Separator } from "@/components/ui/separator";
import { authenticatedRateLimit } from "@/utils/rate-limiter";
import { ErrorMessage } from "@/components/Message";

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
    <section className="flex flex-col items-center">
      <div className="flex w-full max-w-[50rem] flex-col space-y-4 rounded-md border px-4 py-8 shadow-xl">
        <h1 className="text-xl font-bold">Create sale report</h1>

        <Separator />

        <NewReportPortal users={users} startCash={startCash} />
      </div>
    </section>
  );
}
