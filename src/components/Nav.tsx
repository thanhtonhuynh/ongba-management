"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps, ReactNode } from "react";

export function Nav({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <nav
      className={cn(
        `flex space-x-2 md:flex-col md:space-x-0 md:space-y-1`,
        className,
      )}
    >
      {children}
    </nav>
  );
}

export function NavLink(props: Omit<ComponentProps<typeof Link>, "className">) {
  const pathname = usePathname();
  return (
    <Link
      {...props}
      className={cn(
        "rounded-md px-4 py-2 text-sm font-medium transition-colors",
        pathname === props.href && "bg-muted",
        pathname !== props.href && "hover:underline",
      )}
    />
  );
}