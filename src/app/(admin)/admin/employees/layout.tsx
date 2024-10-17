import { Separator } from "@/components/ui/separator";
import { NavLink } from "@/components/Nav";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Employees</h1>
      </div>

      <div className="flex h-10 items-center space-x-2">
        <NavLink href={"/admin/employees/active"}>Active</NavLink>
        <NavLink href={"/admin/employees/awaiting-verification"}>
          Awaiting verification
        </NavLink>
        <NavLink href={"/admin/employees/deactivated"}>Deactivated</NavLink>
      </div>

      <Separator className="my-4" />

      {children}
    </section>
  );
}
