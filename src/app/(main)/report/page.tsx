import { Container } from "@/components/Container";
import { getCurrentSession } from "@/lib/auth/session";
import { notFound, redirect } from "next/navigation";
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
