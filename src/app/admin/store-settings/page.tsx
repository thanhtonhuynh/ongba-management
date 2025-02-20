import { ErrorMessage } from "@/components/Message";
import { Separator } from "@/components/ui/separator";
import { getStartCash } from "@/data-access/store";
import { getCurrentSession } from "@/lib/auth/session";
import { hasAccess } from "@/utils/access-control";
import { authenticatedRateLimit } from "@/utils/rate-limiter";
import { notFound, redirect } from "next/navigation";
import { StartCashForm } from "./StartCashForm";

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

  // const currentShiftHours = await getShiftHours();
  const currentStartCash = await getStartCash();

  return (
    <section className="space-y-4">
      <h1>Store settings</h1>

      <Separator className="my-4" />

      {/* <ShiftHoursForm currentShiftHours={currentShiftHours} /> */}

      <StartCashForm currentStartCash={currentStartCash} />
    </section>
  );
}
