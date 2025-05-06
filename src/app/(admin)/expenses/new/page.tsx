import { Container } from "@/components/Container";
import { Header } from "@/components/header";
import { getCurrentSession } from "@/lib/auth/session";
import { hasAccess } from "@/utils/access-control";
import { notFound, redirect } from "next/navigation";
import { Fragment } from "react";
import { ExpensesForm } from "../expenses-form";

export default async function Page() {
  const { session, user } = await getCurrentSession();
  if (!session) redirect("/login");
  if (user.accountStatus !== "active") return notFound();
  if (!hasAccess(user.role, "/admin")) return notFound();

  return (
    <Fragment>
      <Header>
        <h1>Add expense</h1>
      </Header>

      <Container>
        <ExpensesForm />
      </Container>
    </Fragment>
  );
}
