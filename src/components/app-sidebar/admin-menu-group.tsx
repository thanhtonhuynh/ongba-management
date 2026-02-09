"use client";

import { adminMenuItems } from "@/app/constants";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useMediaQuery } from "@/hooks/use-media-query";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { activeMenuItemClass } from "./constant";

export function AdminMenuGroup() {
  const { toggleSidebar } = useSidebar();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="tracking-wide">ADMIN</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {adminMenuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                className="h-12"
                onClick={() => isMobile && toggleSidebar()}
                render={
                  <Link
                    href={item.url}
                    className={pathname === item.url ? activeMenuItemClass : ""}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                }
              />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
