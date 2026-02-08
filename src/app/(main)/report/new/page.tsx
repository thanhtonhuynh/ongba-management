import { Container } from "@/components/Container";
import { Header } from "@/components/layout";
import { ErrorMessage } from "@/components/Message";
import { Typography } from "@/components/typography";
import { getEmployees } from "@/data-access/employee";
import { getStartCash } from "@/data-access/store";
import { getCurrentSession } from "@/lib/auth/session";
import { hasAccess } from "@/utils/access-control";
import { authenticatedRateLimit } from "@/utils/rate-limiter";
import { notFound, redirect } from "next/navigation";
import { Fragment } from "react";
import { SaleReportPortal } from "./sale-report-portal";

export default async function Page() {
  const { session, user } = await getCurrentSession();
  if (!session) redirect("/login");
  if (user.accountStatus !== "active") return notFound();
  if (!hasAccess(user.role, "/report", "create")) return notFound();

  if (!(await authenticatedRateLimit(user.id))) {
    return (
      <ErrorMessage message="Too many requests. Please try again later." />
    );
  }

  const [usersPromise, startCashPromise] = [
    getEmployees("active", true), // true = exclude hidden users
    getStartCash(),
  ];

  return (
    <Fragment>
      <Header>
        <Typography variant="h1">Create sales report</Typography>
      </Header>

      <Container>
        <section className="mx-auto w-full max-w-5xl">
          <SaleReportPortal
            usersPromise={usersPromise}
            startCashPromise={startCashPromise}
            mode="create"
          />
        </section>
      </Container>
    </Fragment>
  );
}
