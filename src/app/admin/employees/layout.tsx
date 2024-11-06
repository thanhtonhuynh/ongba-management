import { Separator } from "@/components/ui/separator";
import { Nav, NavLinkAdmin } from "@/components/Nav";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="space-y-4">
      <h1 className="text-xl font-semibold">Employees</h1>

      <div>
        <Nav className="flex items-center space-x-4">
          <NavLinkAdmin href={"/admin/employees/active"}>Active</NavLinkAdmin>
          <NavLinkAdmin href={"/admin/employees/awaiting-verification"}>
            Awaiting
          </NavLinkAdmin>
          <NavLinkAdmin href={"/admin/employees/deactivated"}>
            Deactivated
          </NavLinkAdmin>
        </Nav>

        <Separator />
      </div>

      {children}
    </section>
  );
}
