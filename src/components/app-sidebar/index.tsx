"use client";

import { logoutAction } from "@/app/(auth)/actions";
import ongbaIcon from "@/assets/ongbaIcon.png";
import { ProfilePicture } from "@/components/ProfilePicture";
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
  useSidebar,
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
  const { toggleSidebar, state } = useSidebar();

  if (!user) return null;

  return (
    <Sidebar collapsible="icon">
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
                <span className="text-primary text-xl font-bold tracking-wider">
                  ONGBA
                </span>
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
                <SidebarMenuButton className="break-all">
                  {user?.image ? (
                    <ProfilePicture image={user.image} size={40} />
                  ) : (
                    <User2 size={17} />
                  )}
                  <div>
                    <p className="line-clamp-1 text-sm font-bold">
                      {user?.name}
                    </p>
                    <p className="text-muted-foreground text-xs font-medium capitalize">
                      {user?.role}
                    </p>
                    <p className="text-muted-foreground line-clamp-1 text-xs">
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
