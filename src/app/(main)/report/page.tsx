import { Container } from "@/components/Container";
import { Header } from "@/components/header";
import { getCurrentSession } from "@/lib/auth/session";
import { notFound, redirect } from "next/navigation";
import { Fragment } from "react";
import { ReportPicker } from "./ReportPicker";

export default async function Page() {
  const { session, user } = await getCurrentSession();
  if (!session) redirect("/login");
  if (user.accountStatus !== "active") return notFound();

  return (
    <Fragment>
      <Header>
        <h1>Past report lookup</h1>
      </Header>

      <Container>
        <section className="">
          <ReportPicker />
        </section>
      </Container>
    </Fragment>
  );
}
