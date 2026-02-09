import { Container } from "@/components/Container";
import { Header } from "@/components/layout";
import { Typography } from "@/components/typography";
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
        {/* <div className="flex flex-1 items-center justify-between"> */}
        <Typography variant="h1">Hours & Tips</Typography>
        {/* {years.length > 0 && <ViewPeriodsDialog years={years} />} */}
        {/* </div> */}
      </Header>

      <Container>
        {years.length > 0 && <ViewPeriodsDialog years={years} />}
        {children}
      </Container>
    </Fragment>
  );
}
