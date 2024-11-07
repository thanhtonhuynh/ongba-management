import { Separator } from "@/components/ui/separator";
import { Nav, NavLink } from "@/components/Nav";
import { getCurrentSession } from "@/lib/auth/session";
import { hasAccess } from "@/utils/access-control";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await getCurrentSession();

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Employees</h1>

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
    </section>
  );
}
