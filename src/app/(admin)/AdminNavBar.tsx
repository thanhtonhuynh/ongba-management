import { Nav, NavLinkAdmin } from "@/components/Nav";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCurrentSession } from "@/lib/auth/session";
import { hasAccess } from "@/utils/access-control";
import { Menu } from "lucide-react";
import Link from "next/link";

export async function AdminNavBar() {
  const { user } = await getCurrentSession();
  if (!user) return null;

  return (
    <aside className="hidden sm:block md:w-1/5">
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

export async function AdminNavBarMobile() {
  const { user } = await getCurrentSession();
  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="absolute right-3 top-2 sm:hidden" asChild>
        <Button
          size="icon"
          className="flex-none rounded-full border bg-background text-primary shadow-md hover:bg-muted"
        >
          <Menu />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-48">
        <DropdownMenuItem asChild>
          <Link href="/admin" className="cursor-pointer">
            Dashboard
          </Link>
        </DropdownMenuItem>

        {hasAccess(user.role, "/admin/hours&tips") && (
          <DropdownMenuItem asChild>
            <Link href={`/admin/hours&tips`} className="cursor-pointer">
              Hours & Tips
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem asChild>
          <Link href={`/admin/employees`} className="cursor-pointer">
            Employees
          </Link>
        </DropdownMenuItem>

        {hasAccess(user.role, "/admin/store-settings") && (
          <DropdownMenuItem asChild>
            <Link href={`/admin/store-settings`} className="cursor-pointer">
              Store settings
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
