"use client";

import { MoonIcon, SunIcon, DesktopIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function ModeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="space-x-1 rounded-full p-1 sm:border">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("system")}
        className={cn(
          "h-7 w-7 rounded-full",
          theme === "system"
            ? "bg-muted"
            : "text-muted-foreground hover:bg-background hover:text-foreground",
        )}
      >
        <DesktopIcon />
        <span className="sr-only">System mode</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("light")}
        className={cn(
          "h-7 w-7 rounded-full",
          theme === "light"
            ? "bg-muted"
            : "text-muted-foreground hover:bg-background hover:text-foreground",
        )}
      >
        <SunIcon />
        <span className="sr-only">Light mode</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("dark")}
        className={cn(
          "h-7 w-7 rounded-full",
          theme === "dark"
            ? "bg-muted"
            : "text-muted-foreground hover:bg-background hover:text-foreground",
        )}
      >
        <MoonIcon />
        <span className="sr-only">Dark mode</span>
      </Button>
    </div>
  );
}
