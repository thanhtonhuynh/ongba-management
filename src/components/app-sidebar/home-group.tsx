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

export function HomeGroup() {
  const { toggleSidebar } = useSidebar();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu className="font-space-grotesk">
          <SidebarMenuItem>
            <SidebarMenuButton
              className="h-12 font-medium"
              onClick={() => isMobile && toggleSidebar()}
              render={
                <Link href={"/"} className={pathname === "/" ? activeMenuItemClass : ""}>
                  <HugeiconsIcon icon={ICONS.HOME} strokeWidth={2} />
                  <span>Home</span>
                </Link>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
