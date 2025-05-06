import { Container } from "@/components/Container";
import { Header } from "@/components/header";
import { populateMonthSelectData } from "@/utils/hours-tips";
import { Fragment } from "react";
import { ViewPeriodsDialog } from "./_components/ViewPeriodsDialog";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { years } = await populateMonthSelectData();

  return (
    <Fragment>
      <Header>
        <h1>Hours & Tips</h1>
      </Header>

      <Container>
        {years.length > 0 && <ViewPeriodsDialog years={years} />}
        {children}
      </Container>
    </Fragment>
  );
}
