import { Nav, NavLink } from "@/components/Nav";
import { getCurrentSession } from "@/lib/auth/session";
import { hasAccess } from "@/utils/access-control";

export async function AdminNavBar() {
  const { user } = await getCurrentSession();
  if (!user) return null;

  return (
    <aside className="md:w-1/5">
      <Nav>
        <NavLink href={"/admin"}>Dashboard</NavLink>

        {hasAccess(user.role, "/admin/hours&tips") && (
          <NavLink href={`/admin/hours&tips`}>Hours & Tips</NavLink>
        )}

        <NavLink href={`/admin/employees`}>Employees</NavLink>

        {hasAccess(user.role, "/admin/store-settings") && (
          <NavLink href={`/admin/store-settings`}>Store settings</NavLink>
        )}
      </Nav>
    </aside>
  );
}
