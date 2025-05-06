"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { PanelLeftIcon } from "lucide-react";
import { ComponentProps } from "react";
import { Button } from "./ui/button";

export function Header({
  children,
  className,
  ...props
}: ComponentProps<"header">) {
  const { toggleSidebar } = useSidebar();

  return (
    <header
      className={cn(
        "bg-background sticky top-0 flex h-16 shrink-0 items-center gap-4 rounded-t-xl border-b px-4 md:px-8",
        className,
      )}
      {...props}
    >
      <Button
        variant={"outline"}
        onClick={toggleSidebar}
        className="h-8 text-sm font-normal md:hidden"
      >
        <PanelLeftIcon className="size-4" />
        <span>Menu</span>
      </Button>
      {children}
    </header>
  );
}
