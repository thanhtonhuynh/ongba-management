"use client";

import { logoutAction } from "@/app/(auth)/actions";
import ongbaIcon from "@/assets/ongbaIcon.png";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useSession } from "@/contexts/SessionProvider";
import { ChevronUp, LogOut, User2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AccountMenuGroup } from "./account-menu-group";
import { AdminMenuGroup } from "./admin-menu-group";
import { HomeGroup } from "./home-group";
import { SidebarTrigger } from "./sidebar-trigger";
import { StaffMenuGroup } from "./staff-menu-group";

export function AppSidebar() {
  const { user } = useSession();

  if (!user) return null;

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size={"lg"} asChild>
              <Link href={"/"}>
                <Image
                  src={ongbaIcon}
                  alt="Ongba Logo"
                  width={40}
                  height={40}
                  className="aspect-square object-cover dark:invert"
                />
                <span className="text-xl font-bold tracking-wider">ONGBA</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarTrigger />
        <SidebarSeparator />
        <HomeGroup />
        <SidebarSeparator />
        <StaffMenuGroup />
        <SidebarSeparator />
        <AdminMenuGroup />
        <SidebarSeparator />
        <AccountMenuGroup />
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="h-fit cursor-pointer">
                <SidebarMenuButton className="group-data-[collapsible=icon]:p-0!">
                  <span className="relative flex size-8 shrink-0 items-center justify-center shadow-xs">
                    {user?.image ? (
                      <Image
                        src={user?.image}
                        alt={"User profile picture"}
                        fill
                        sizes="40px"
                        className="aspect-square size-full rounded-lg border object-cover shadow-xs"
                      />
                    ) : (
                      <User2 className="size-4 border" />
                    )}
                  </span>
                  <div className="flex-1">
                    <p className="truncate text-sm font-bold">{user?.name}</p>
                    <p className="text-muted-foreground text-xs font-medium capitalize">
                      {user?.role}
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      {user?.email}
                    </p>
                  </div>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                side="top"
                className="w-(--radix-popper-anchor-width)"
              >
                <DropdownMenuItem asChild className="p-0">
                  <form action={logoutAction}>
                    <Button variant={`ghost`} className="w-full justify-start">
                      <LogOut className="size-4" /> Sign Out
                    </Button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
