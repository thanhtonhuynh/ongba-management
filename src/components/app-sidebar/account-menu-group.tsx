"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ICONS } from "@/constants/icons";
import { useMediaQuery } from "@/hooks/use-media-query";
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
        <SidebarMenu className="font-space-grotesk">
          <SidebarMenuItem>
            <SidebarMenuButton
              className="h-12 font-medium"
              onClick={() => isMobile && toggleSidebar()}
              render={
                <Link
                  href={`/profile/${username}`}
                  className={pathname === `/profile/${username}` ? activeMenuItemClass : ""}
                >
                  <HugeiconsIcon icon={ICONS.USER_ACCOUNT} strokeWidth={2} />
                  <span>My Profile</span>
                </Link>
              }
            />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="h-12 font-medium"
              onClick={() => isMobile && toggleSidebar()}
              render={
                <Link
                  href="/settings"
                  className={pathname === "/settings" ? activeMenuItemClass : ""}
                >
                  <HugeiconsIcon icon={ICONS.ACCOUNT_SETTINGS} strokeWidth={2} />
                  <span>Account Settings</span>
                </Link>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
