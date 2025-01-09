"use client";
import { lazy, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { TailwindIndicator } from "../tailwind-indicator";

const LzDevTools = lazy(() =>
  import("./DevToolsView").then((x) => ({ default: x.DevToolsView })),
);

interface DevToolsLoaderProps {
  hotKey?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}
export const DevTools = (props: DevToolsLoaderProps) => {
  const [open, setOpen] = useState(props.open);
  const hotKey = props.hotKey || "ctrl+0";
  useHotkeys(hotKey, () => {
    setOpen(!open);
  });
  return (
    <>
      {open && <LzDevTools open={open} onOpenChange={setOpen} />}
      <TailwindIndicator />
    </>
  );
};
