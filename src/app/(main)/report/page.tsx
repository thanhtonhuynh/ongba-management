import { Container } from "@/components/Container";
import { getCurrentSession } from "@/lib/auth/session";
import { notFound, redirect } from "next/navigation";

export default async function Page() {
  const { session, user } = await getCurrentSession();
  if (!session) redirect("/login");
  if (user.accountStatus !== "active") return notFound();

  return <Container>Page</Container>;
}
