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

type AccountMenuGroupProps = {
  username: string;
};

export function AccountMenuGroup({ username }: AccountMenuGroupProps) {
  const { toggleSidebar } = useSidebar();
  const isMobile = useMediaQuery("(max-width: 768px)");

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
                <Link href={`/profile/${username}`}>
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
                <Link href="/settings">
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
