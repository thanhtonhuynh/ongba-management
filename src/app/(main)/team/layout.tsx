import { Container } from "@/components/Container";
import { Header } from "@/components/layout";
import { Typography } from "@/components/typography";
import { Metadata } from "next/types";
import { Fragment } from "react";

export const metadata: Metadata = { title: "Team - Serva" };

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Fragment>
      <Header>
        <Typography variant="page-title">Team</Typography>
      </Header>

      <Container>{children}</Container>
    </Fragment>
  );
}
