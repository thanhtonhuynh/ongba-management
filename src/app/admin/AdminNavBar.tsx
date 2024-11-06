import { Nav, NavLinkAdmin } from "@/components/Nav";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import Link from "next/link";

export function AdminNavBar() {
  return (
    <aside className="hidden sm:block">
      <Nav className="space-x-4">
        <NavLinkAdmin href={"/admin"}>Dashboard</NavLinkAdmin>

        <NavLinkAdmin href={`/admin/hours&tips`}>Hours & Tips</NavLinkAdmin>

        <NavLinkAdmin href={`/admin/cashflow`}>Cashflow</NavLinkAdmin>

        <NavLinkAdmin href={`/admin/store-settings`}>
          Store Settings
        </NavLinkAdmin>
      </Nav>
    </aside>
  );
}

export function AdminNavBarMobile() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="absolute right-3 top-0 sm:hidden" asChild>
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

        <DropdownMenuItem asChild>
          <Link href={`/admin/hours&tips`} className="cursor-pointer">
            Hours & Tips
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={`/admin/cashflow`} className="cursor-pointer">
            Cashflow
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={`/admin/store-settings`} className="cursor-pointer">
            Store settings
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
