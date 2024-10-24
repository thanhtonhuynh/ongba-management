"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps, ReactNode } from "react";
import { Button } from "./ui/button";

export function Nav({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <nav className={cn(`flex space-x-2`, className)}>{children}</nav>;
}

export function NavLink(props: Omit<ComponentProps<typeof Link>, "className">) {
  const pathname = usePathname();
  const { href } = props;
  const isActive = pathname === href;

  return (
    <Button
      asChild
      variant={`link`}
      className={cn("font-normal", !isActive && "text-muted-foreground")}
    >
      <Link
        {...props}
        className={cn(isActive && "cursor-default bg-muted hover:no-underline")}
      />
    </Button>
  );
}

export function NavLinkAdmin(
  props: Omit<ComponentProps<typeof Link>, "className">,
) {
  const pathname = usePathname();
  const { href } = props;
  const isActive =
    pathname === href ||
    (pathname.startsWith(href as string) && href !== "/admin");

  return (
    <Link
      {...props}
      className={cn(
        "rounded-md px-4 py-2 text-sm font-medium transition-colors",
        isActive && "bg-muted",
        !isActive && "hover:underline",
      )}
    />
  );
}
