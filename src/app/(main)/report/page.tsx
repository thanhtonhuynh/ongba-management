import { Container } from "@/components/Container";
import { getAllReports } from "@/data/report";
import { getCurrentSession } from "@/lib/auth/session";
import { notFound, redirect } from "next/navigation";
import { processReportDataForView } from "@/utils/report";
import { ReportPicker } from "./ReportPicker";

export default async function Page() {
  const { session, user } = await getCurrentSession();
  if (!session) redirect("/login");
  if (user.accountStatus !== "active") return notFound();

  return (
    <Container>
      <ReportPicker />
    </Container>
  );
}
