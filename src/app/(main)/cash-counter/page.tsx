import { CashCounter } from "@/app/(main)/cash-counter/CashCounter";
import { Container } from "@/components/Container";
import { Header } from "@/components/header";
import { getCurrentSession } from "@/lib/auth/session";
import { notFound, redirect } from "next/navigation";
import { Fragment } from "react";

export default async function Page() {
  const { session, user } = await getCurrentSession();
  if (!session) redirect("/login");
  if (user.accountStatus !== "active") return notFound();

  return (
    <Fragment>
      <Header>
        <h1>Cash Counter</h1>
      </Header>

      <Container>
        <CashCounter />
      </Container>
    </Fragment>
  );
}
