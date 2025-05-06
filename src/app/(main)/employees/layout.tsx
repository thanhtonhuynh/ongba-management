import { Container } from "@/components/Container";
import { Header } from "@/components/header";
import { Nav, NavLink } from "@/components/Nav";
import { Separator } from "@/components/ui/separator";
import { getCurrentSession } from "@/lib/auth/session";
import { hasAccess } from "@/utils/access-control";
import { Fragment } from "react";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await getCurrentSession();

  return (
    <Fragment>
      <Header>
        <h1>Employees</h1>
      </Header>

      <Container>
        <div>
          {user && hasAccess(user.role, "/employees", "update") && (
            <Nav className="flex items-center space-x-4">
              <NavLink href={"/employees/active"}>Active</NavLink>
              <NavLink href={"/employees/awaiting-verification"}>
                Awaiting
              </NavLink>
              <NavLink href={"/employees/deactivated"}>Deactivated</NavLink>
            </Nav>
          )}
          <Separator />
        </div>

        {children}
      </Container>
    </Fragment>
  );
}
