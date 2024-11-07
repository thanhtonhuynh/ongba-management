import { getCurrentSession } from "@/lib/auth/session";
import { notFound, redirect } from "next/navigation";
import { ReportPicker } from "./ReportPicker";
import { Separator } from "@/components/ui/separator";

export default async function Page() {
  const { session, user } = await getCurrentSession();
  if (!session) redirect("/login");
  if (user.accountStatus !== "active") return notFound();

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">View Report</h1>

      <Separator />

      <ReportPicker />
    </section>
  );
}
