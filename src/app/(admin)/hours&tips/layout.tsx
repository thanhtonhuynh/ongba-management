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
        <div className="flex flex-1 items-center justify-between">
          <h1>Hours & Tips</h1>
          {years.length > 0 && <ViewPeriodsDialog years={years} />}
        </div>
      </Header>

      <Container>{children}</Container>
    </Fragment>
  );
}
