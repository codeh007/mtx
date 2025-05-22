"use client";

import { RouterProvider } from "@tanstack/react-router";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { getQueryClient } from "./lib/get-query-client";
import { createRouter } from "./router";
import { MtmaiProvider } from "./stores/MtmaiProvider";
import { UIProviders } from "./stores/UIProviders";
export function MtmClientApp({ serverUrl }: { serverUrl: string }) {
  return (
    <MtmaiProvider serverUrl={serverUrl}>
      <UIProviders>
        <RouterProvider
          router={createRouter()}
          context={{
            tid: "",
            queryClient: getQueryClient(),
          }}
        />
      </UIProviders>
    </MtmaiProvider>
  );
}

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

export function AppLoader({ serverUrl }: { serverUrl: string }) {
  useEffect(() => {
    loadAppp({ serverUrl });
  }, [serverUrl]);
  return null;
}
