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
        "bg-background/70 sticky top-0 z-50 flex h-16 shrink-0 items-center gap-4 border-b px-4 backdrop-blur-sm md:rounded-t-xl md:px-8",
        className,
      )}
      {...props}
    >
      <Button
        variant={"outline"}
        size={"icon"}
        onClick={toggleSidebar}
        className="h-8 text-sm font-normal md:hidden"
      >
        <PanelLeftIcon className="size-4" />
        <span className="sr-only">Menu</span>
      </Button>

      {children}
    </header>
  );
}
