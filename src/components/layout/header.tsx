import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

export function Header({
  children,
  className,
  ...props
}: ComponentProps<"header">) {
  return (
    <header
      className={cn(
        "bg-background flex h-16 shrink-0 items-center gap-3 rounded-xl border border-blue-950 px-3",
        className,
      )}
      {...props}
    >
      <SidebarTrigger />

      <Separator orientation="vertical" className={"mr-2"} />

      {children}
    </header>
  );
}
