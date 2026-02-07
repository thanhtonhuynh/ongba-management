import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

type Props = {
  variant: "page-title" | "section-title" | "body-text";
};

export function Typography({
  variant,
  className,
  children,
  ...props
}: Props & ComponentProps<"div">) {
  return (
    <div
      className={cn(
        variant === "page-title" &&
          "text-xl font-bold tracking-wide text-blue-950",
        variant === "section-title" && "font-bold text-blue-950",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
