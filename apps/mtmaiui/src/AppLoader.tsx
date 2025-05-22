"use client";

import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { MtmClientApp } from "./App";
// declare global {
//   //可能没用了.
//   interface Window {
//     __POST_APP_STATE__: {
//       isAuthenticated: boolean;
//       userId: string;
//       posts: Array<{ id: string }>;
//     };
//   }
// }
function loadAppp({ serverUrl }: { serverUrl: string }) {
  const rootElementId = "gomtm-runtime-container";

  if (typeof window !== "undefined") {
    console.log("👍 AppLoader load...");
    // window.addEventListener("load", () => {
    //   onMount();
    // });
    let rootElement = document.getElementById(rootElementId);
    if (!rootElement) {
      rootElement = document.createElement("div");
      rootElement.id = rootElementId;
      rootElement.style.width = "0px";
      rootElement.style.height = "0px";
      rootElement.style.position = "absolute"; // 脱离文档流
      rootElement.style.overflow = "hidden"; // 防止内容溢出
      // rootElement.style.visibility = "hidden"; // 视觉上隐藏但保持功能
      // rootElement.style.pointerEvents = "none"; // 防止鼠标交互
      rootElement.style.margin = "0";
      rootElement.style.padding = "0";
      document.body.appendChild(rootElement);
    }
    if (rootElement) {
      createRoot(rootElement).render(
        <MtSuspenseBoundary>
          <MtmClientApp serverUrl={serverUrl} />
        </MtSuspenseBoundary>,
      );
    }
  }
}
// if (typeof window !== "undefined") {
//   // loadAppp({ serverUrl: getAppConfig().mtmServerUrl });
// }

// export default loadAppp;

export function AppLoader({ serverUrl }: { serverUrl: string }) {
  useEffect(() => {
    loadAppp({ serverUrl });
  }, [serverUrl]);
  return null;
}
