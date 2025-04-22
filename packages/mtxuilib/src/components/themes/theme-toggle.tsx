"use client";

import { Moon, Sun } from "lucide-react";
// import { Bug, Moon, Sun, Trash } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "../../ui/button";
export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // const [theme, setTheme] = useState<"dark" | "light">(() => {
  //   // Check localStorage first, default to dark if not found
  //   const savedTheme = localStorage.getItem("theme");
  //   return (savedTheme as "dark" | "light") || "dark";
  // });

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Apply theme class on mount and when theme changes
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }

    // Save theme preference to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  if (!mounted) {
    return null;
  }
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        <Sun className="h-6 w-[1.3rem] dark:hidden" />
        <Moon className="hidden h-5 w-5 dark:block" />
        <span className="sr-only">Toggle theme</span>
      </Button>

      <Button variant="ghost" className="rounded-full h-9 w-9" onClick={toggleTheme}>
        {theme === "dark" ? (
          <Sun size={20} className="size-4" />
        ) : (
          <Moon size={20} className="size-4" />
        )}
      </Button>
    </>
  );
}
