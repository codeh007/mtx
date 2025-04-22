"use client";

import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { createRoot } from "react-dom/client";
import { MtmClientApp } from "./App";
import { onMount } from "./onMount";

if (typeof window !== "undefined") {
  window.addEventListener("load", () => {
    onMount();
  });
  const rootElement = document.getElementById("gomtm-runtime-container");
  if (rootElement) {
    //TODO: 需要加载独立的 应用, 还需要正确处理 相关的 Provider
    createRoot(rootElement).render(<MtSuspenseBoundary>{<MtmClientApp />}</MtSuspenseBoundary>);
  }
}
