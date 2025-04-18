"use client";
import type { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

export const ReactQueryDevtoolsProduction: typeof ReactQueryDevtools = dynamic(
  () =>
    import("@tanstack/react-query-devtools/build/modern/production.js").then(
      (d) => ({
        default: d.ReactQueryDevtools,
      }),
    ),
  {
    ssr: false,
  },
) as typeof ReactQueryDevtools;

const hotKeyDebug = "alt+.";
interface DevToolsProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}
export const DevToolsView = (props: DevToolsProps) => {
  const { open: propsOpen, onOpenChange } = props;
  const [internalOpen, setInternalOpen] = useState(false);
  const open = propsOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;
  useHotkeys(
    hotKeyDebug,
    () => {
      console.log("debug2:%o", !open);
      setOpen(!open);
    },
    [open, setOpen],
  );

  if (!open) {
    return null;
  }
  return (
    <>
      <ReactQueryDevtoolsProduction buttonPosition="bottom-right" />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
};
