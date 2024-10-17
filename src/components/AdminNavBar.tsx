import { Nav, NavLink } from "./Nav";

export function AdminNavBar() {
  return (
    <aside className="md:w-1/5">
      <Nav>
        <NavLink href={"/admin"}>Dashboard</NavLink>
        <NavLink href={`/admin/employees`}>Employees</NavLink>
        <NavLink href={`/admin/store-settings`}>Store settings</NavLink>
      </Nav>
    </aside>
  );
}
