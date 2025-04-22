"use client";

import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { createRoot } from "react-dom/client";
import { MtmClientApp } from "./App";
declare global {
  //可能没用了.
  interface Window {
    __POST_APP_STATE__: {
      isAuthenticated: boolean;
      userId: string;
      posts: Array<{ id: string }>;
    };
  }
}
function loadAppp() {
  const rootElementId = "gomtm-runtime-container";

  if (typeof window !== "undefined") {
    console.log("AppLoader 加载");
    // window.addEventListener("load", () => {
    //   onMount();
    // });
    let rootElement = document.getElementById(rootElementId);
    if (!rootElement) {
      rootElement = document.createElement("div");
      rootElement.id = rootElementId;
      document.body.appendChild(rootElement);
    }
    if (rootElement) {
      createRoot(rootElement).render(<MtSuspenseBoundary>{<MtmClientApp />}</MtSuspenseBoundary>);
    }
  }
}
if (typeof window !== "undefined") {
  loadAppp();
}

export default loadAppp;
