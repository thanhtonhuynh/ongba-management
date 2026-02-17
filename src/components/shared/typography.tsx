import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

type Props = {
  variant?: "h1" | "h2" | "h3" | "p" | "caption" | "p-sm";
};

export function Typography({
  variant = "p",
  className,
  children,
  ...props
}: Props & ComponentProps<"div">) {
  return (
    <div
      className={cn(
        // page-title
        variant === "h1" && "text-lg font-bold tracking-wide text-blue-950 uppercase",
        // section-title
        variant === "h2" && "text-base font-bold tracking-wide text-blue-950",
        // subsection-title
        variant === "h3" && "text-xs font-semibold tracking-wide text-blue-950 uppercase",
        // caption
        variant === "caption" && "text-sm font-semibold",
        // body
        variant === "p" && "space-y-1",
        variant === "p-sm" && "space-y-1 text-sm",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
