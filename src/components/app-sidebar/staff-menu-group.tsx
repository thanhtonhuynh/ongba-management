"use client";

import { staffMenuItems } from "@/app/constants";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useMediaQuery } from "@/hooks/use-media-query";
import Link from "next/link";

export function StaffMenuGroup() {
  const { toggleSidebar } = useSidebar();
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {staffMenuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className="h-12"
                onClick={() => isMobile && toggleSidebar()}
              >
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
