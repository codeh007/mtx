"use client";
import { useTheme } from "next-themes";
import * as React from "react";
import { IconMoon, IconSun } from "../icons/icons-ai";
import { Button } from "../ui/button";

export function ThemeToggle() {
  // useTheme 有一个坑，因为如果是ssr，实际上无法获取到 media query 的值，所以ssr 出现 Hydration Mismatch 而且无法直接避免。
  // 根据官方文档，直接触发Hydration 错误的是 useTheme hook的调用，必须在 mounted 后，在显示接下来的ui能够避免这个问题。
  // 参考：https://github.com/pacocoursey/next-themes
  const { setTheme, theme } = useTheme();
  const [_, startTransition] = React.useTransition();
  const [mounted, setMounted] = React.useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        startTransition(() => {
          setTheme(theme === "light" ? "dark" : "light");
        });
      }}
    >
      {!theme ? null : theme === "dark" ? (
        <IconMoon className="transition-all" />
      ) : (
        <IconSun className="transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
