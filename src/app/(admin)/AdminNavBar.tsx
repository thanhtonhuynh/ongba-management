import { Nav, NavLinkAdmin } from "@/components/Nav";
import { getCurrentSession } from "@/lib/auth/session";
import { hasAccess } from "@/utils/access-control";

export async function AdminNavBar() {
  const { user } = await getCurrentSession();
  if (!user) return null;

  return (
    <aside className="md:w-1/5">
      <Nav>
        <NavLinkAdmin href={"/admin"}>Dashboard</NavLinkAdmin>

        {hasAccess(user.role, "/admin/hours&tips") && (
          <NavLinkAdmin href={`/admin/hours&tips`}>Hours & Tips</NavLinkAdmin>
        )}

        <NavLinkAdmin href={`/admin/employees`}>Employees</NavLinkAdmin>

        {hasAccess(user.role, "/admin/store-settings") && (
          <NavLinkAdmin href={`/admin/store-settings`}>
            Store settings
          </NavLinkAdmin>
        )}
      </Nav>
    </aside>
  );
}
