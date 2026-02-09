"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Settings01Icon, UserAccountIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { activeMenuItemClass } from "./constant";

type AccountMenuGroupProps = {
  username: string;
};

export function AccountMenuGroup({ username }: AccountMenuGroupProps) {
  const { toggleSidebar } = useSidebar();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const pathname = usePathname();

  return (
    <SidebarGroup>
      {/* <SidebarGroupLabel>Account</SidebarGroupLabel> */}
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="h-12"
              onClick={() => isMobile && toggleSidebar()}
              render={
                <Link
                  href={`/profile/${username}`}
                  className={
                    pathname === `/profile/${username}`
                      ? activeMenuItemClass
                      : ""
                  }
                >
                  <HugeiconsIcon icon={UserAccountIcon} className="size-4" />
                  <span>My profile</span>
                </Link>
              }
            />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="h-12"
              onClick={() => isMobile && toggleSidebar()}
              render={
                <Link
                  href="/settings"
                  className={
                    pathname === "/settings" ? activeMenuItemClass : ""
                  }
                >
                  <HugeiconsIcon icon={Settings01Icon} className="size-4" />
                  <span>Settings</span>
                </Link>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
