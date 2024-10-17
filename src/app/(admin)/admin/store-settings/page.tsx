import { Separator } from "@/components/ui/separator";
import { getCurrentSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { ShiftHoursForm } from "./ShiftHoursForm";
import { getShiftHours, getStartCash } from "@/data/store";
import { StartCashForm } from "./StartCashForm";

export default async function Page() {
  const { session, user } = await getCurrentSession();
  if (!session) redirect("/login");
  if (!user.userVerified) redirect("/user-not-verify");
  if (!user.role || user.role !== "admin") redirect("/");

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
