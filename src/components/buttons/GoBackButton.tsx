"use client";

import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface GoBackButtonProps extends ButtonProps {
  url?: string;
}

export function GoBackButton({ className, url, ...props }: GoBackButtonProps) {
  const router = useRouter();

  return (
    <Button
      className={cn("flex items-center gap-2", className)}
      {...props}
      onClick={() => (url ? router.push(url) : router.back())}
    >
      <ArrowLeft size={props.size === "sm" ? 12 : 15} />
      {props.children}
    </Button>
  );
}
