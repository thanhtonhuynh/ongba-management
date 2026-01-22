import { Container } from "@/components/Container";
import { Header } from "@/components/header";
import { Fragment } from "react";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Fragment>
      <Header>
        <h1>Employees</h1>
      </Header>

      <Container>{children}</Container>
    </Fragment>
  );
}
