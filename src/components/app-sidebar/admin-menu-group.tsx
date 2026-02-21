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
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { activeMenuItemClass } from "./constant";

export function AdminMenuGroup() {
  const { toggleSidebar } = useSidebar();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="font-space-grotesk">ADMIN</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="font-space-grotesk">
          {adminMenuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                className="h-12 font-medium"
                onClick={() => isMobile && toggleSidebar()}
                render={
                  <Link
                    href={item.url}
                    className={pathname === item.url ? activeMenuItemClass : ""}
                  >
                    <HugeiconsIcon icon={item.icon} strokeWidth={2} />
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
