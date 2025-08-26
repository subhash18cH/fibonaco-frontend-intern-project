/**
 * Custom Component to toggle between light and dark mode
 */

"use client";

// External Imports
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

// ShadCN Imports
import { Button } from "@/components/ui/button";

// Theme Toggle Button
function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button size="icon" variant="outline" className="text-muted-foreground cursor-pointer"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
      <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 dark:scale-0" />
      <Sun className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 dark:rotate-0 dark:scale-110" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export default ThemeToggle;