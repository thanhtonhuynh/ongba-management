import { Container } from "@/components/Container";
import { Header } from "@/components/layout";
import { ErrorMessage } from "@/components/Message";
import { Typography } from "@/components/typography";
import { getStartCash } from "@/data-access/store";
import { getCurrentSession } from "@/lib/auth/session";
import { hasAccess } from "@/utils/access-control";
import { authenticatedRateLimit } from "@/utils/rate-limiter";
import { notFound, redirect } from "next/navigation";
import { Fragment } from "react";
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

  const currentStartCash = await getStartCash();

  return (
    <Fragment>
      <Header>
        <Typography variant="page-title">Store Settings</Typography>
      </Header>

      <Container>
        <StartCashForm currentStartCash={currentStartCash / 100} />
      </Container>
    </Fragment>
  );
}
