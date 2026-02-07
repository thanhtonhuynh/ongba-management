import { CashCalculator } from "@/app/(main)/cash-calculator/cash-calculator";
import { Container } from "@/components/Container";
import { Header } from "@/components/layout";
import { Typography } from "@/components/typography";
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
        <Typography variant="page-title">Cash calculator</Typography>
      </Header>

      <Container>
        <CashCalculator />
      </Container>
    </Fragment>
  );
}
