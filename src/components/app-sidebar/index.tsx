"use client";

import { logoutAction } from "@/app/(auth)/actions";
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
import { cn } from "@/lib/utils";
import { ChevronUp, LogOut, User2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AccountMenuGroup } from "./account-menu-group";
import { AdminMenuGroup } from "./admin-menu-group";
import { HomeGroup } from "./home-group";
import { StaffMenuGroup } from "./staff-menu-group";

export function AppSidebar() {
  const { user } = useSession();
  const { state, isMobile } = useSidebar();

  if (!user) return null;

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size={"lg"}
              render={
                <Link className="hover:bg-transparent" href={"/"}>
                  <Image
                    priority
                    src={
                      state === "collapsed" && !isMobile
                        ? "/serva-logo-icon.svg"
                        : "/serva-logo-full.svg"
                    }
                    alt="Serva"
                    width={240}
                    height={80}
                    className={cn(
                      state === "collapsed" && !isMobile ? "h-6" : "h-10 w-fit",
                    )}
                  />
                  <span className="sr-only">Serva home</span>
                </Link>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <HomeGroup />
        <SidebarSeparator />
        <StaffMenuGroup />
        <SidebarSeparator />
        <AdminMenuGroup />
        <SidebarSeparator />
        <AccountMenuGroup username={user.username} />
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                className="h-fit cursor-pointer"
                render={
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
                }
              />

              <DropdownMenuContent
                side="top"
                className="w-(--radix-popper-anchor-width)"
              >
                <DropdownMenuItem className="p-0">
                  <Button
                    variant={`ghost`}
                    className="w-full justify-start"
                    onClick={async () => {
                      await logoutAction();
                    }}
                  >
                    <LogOut className="size-4" /> Sign Out
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
