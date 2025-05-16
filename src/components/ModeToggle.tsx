"use client";

import { Button } from "@/components/ui/button";
import { DesktopIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ModeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="space-y-4 rounded-lg border p-6 shadow-sm">
      <h6>Theme preference</h6>

      <div className="flex flex-col items-start gap-3">
        <Button
          variant="outline"
          onClick={() => setTheme("light")}
          disabled={theme === "light"}
          className="disabled:bg-muted"
        >
          <SunIcon />
          <span>Light mode</span>
        </Button>

        <Button
          variant="outline"
          onClick={() => setTheme("dark")}
          disabled={theme === "dark"}
          className="disabled:bg-muted"
        >
          <MoonIcon />
          <span>Dark mode</span>
        </Button>

        <Button
          variant="outline"
          onClick={() => setTheme("system")}
          disabled={theme === "system"}
          className="disabled:bg-muted"
        >
          <DesktopIcon />
          <span>System</span>
        </Button>
      </div>
    </div>
  );
}
