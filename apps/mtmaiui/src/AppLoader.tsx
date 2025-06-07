"use client";

import { RouterProvider } from "@tanstack/react-router";
import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { getQueryClient } from "./lib/get-query-client";
import { createRouter } from "./router";
import { MtmaiProvider } from "./stores/MtmaiProvider";
import { UIProviders } from "./stores/UIProviders";
export function MtmClientApp({ serverUrl, config }: { serverUrl: string; config: any }) {
  return (
    <MtmaiProvider serverUrl={serverUrl} config={config}>
      <UIProviders>
        <RouterProvider
          router={createRouter({ serverUrl })}
          context={{
            serverUrl: serverUrl,
            queryClient: getQueryClient(),
          }}
        />
      </UIProviders>
    </MtmaiProvider>
  );
}

function loadAppp({ serverUrl, config }: { serverUrl: string; config: any }) {
  if (typeof window === "undefined") {
    return;
  }
  console.log("👍 MtmApp 💨");
  const rootElementId = "gomtm-runtime-container";
  let rootEle = document.getElementById(rootElementId);
  if (!rootEle) {
    rootEle = document.createElement("div");
    rootEle.id = rootElementId;
    // rootEle.style.width = "0px";
    // rootEle.style.height = "0px";
    // rootEle.style.position = "absolute"; // 脱离文档流
    // rootEle.style.overflow = "hidden"; // 防止内容溢出
    // rootEle.style.margin = "0";
    // rootEle.style.padding = "0";
    document.body.appendChild(rootEle);
  }
  createRoot(rootEle).render(<MtmClientApp serverUrl={serverUrl} config={config} />);
}

export function AppLoader({ serverUrl, config }: { serverUrl: string; config: any }) {
  useEffect(() => {
    loadAppp({ serverUrl, config });
  }, [serverUrl, config]);
  return null;
}
