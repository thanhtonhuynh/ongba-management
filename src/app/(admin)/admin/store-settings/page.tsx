import { Separator } from "@/components/ui/separator";
import { getCurrentSession } from "@/lib/auth/session";
import { notFound, redirect } from "next/navigation";
import { ShiftHoursForm } from "./ShiftHoursForm";
import { getShiftHours, getStartCash } from "@/data/store";
import { StartCashForm } from "./StartCashForm";
import { hasAccess } from "@/utils/access-control";

export default async function Page() {
  const { session, user } = await getCurrentSession();
  if (!session) redirect("/login");
  if (user.accountStatus !== "active") return notFound();
  if (!hasAccess(user.role, "/admin/store-settings")) return notFound();

  const currentShiftHours = await getShiftHours();
  const currentStartCash = await getStartCash();

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Store settings</h1>
      </div>

      <Separator className="my-4" />

      <ShiftHoursForm currentShiftHours={currentShiftHours} />

      <StartCashForm currentStartCash={currentStartCash} />
    </section>
  );
}
