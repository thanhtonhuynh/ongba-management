import { Container } from "@/components/Container";
import { Header } from "@/components/header";
import { ErrorMessage } from "@/components/Message";
import { getEmployees } from "@/data-access/employee";
import { getStartCash } from "@/data-access/store";
import { getCurrentSession } from "@/lib/auth/session";
import { hasAccess } from "@/utils/access-control";
import { authenticatedRateLimit } from "@/utils/rate-limiter";
import { notFound, redirect } from "next/navigation";
import { Fragment } from "react";
import { NewReportPortal } from "./NewReportPortal";

export default async function Page() {
  const { session, user } = await getCurrentSession();
  if (!session) redirect("/login");
  if (user.accountStatus !== "active") return notFound();
  if (!hasAccess(user.role, "/report/new")) return notFound();

  if (!(await authenticatedRateLimit(user.id))) {
    return (
      <ErrorMessage message="Too many requests. Please try again later." />
    );
  }

  const users = await getEmployees("active");
  const startCash = await getStartCash();

  return (
    <Fragment>
      <Header>
        <h1>Create sale report</h1>
      </Header>

      <Container>
        <section className="max-w-5xl">
          <NewReportPortal users={users} startCash={startCash} />
        </section>
      </Container>
    </Fragment>
  );
}
