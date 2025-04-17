"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { client } from "mtmaiapi/gomtmapi/client.gen";
import { MtErrorBoundary } from "mtxuilib/components/MtErrorBoundary";
import { type PropsWithChildren, useMemo } from "react";
import { getQueryClient } from "../lib/get-query-client";

interface ReactQueryProviderProps {
  serverUrl?: string;
  accessToken?: string;
  host?: string;
}
export default function ReactQueryProvider({
  children,
  serverUrl,
  accessToken,
  host,
}: PropsWithChildren<ReactQueryProviderProps>) {
  const queryClient = getQueryClient();
  useMemo(() => {
    let serverUrl2 = serverUrl;
    if (typeof window !== "undefined") {
      serverUrl2 = "";
    } else {
      console.log("query client serverUrl", serverUrl);
    }
    client?.setConfig({
      baseUrl: serverUrl2,
      //允许跨站cookie，这样可以不用专门设置 Authorization header
      credentials: "include", // 提示: 在 cloudflare worker(后端) 中不支持
      fetch: async (req) => {
        console.debug(`🔄,${req.method} ${req.url}`);
        const response = await fetch(req, {
          headers: {
            ...req.headers,
            "Content-Type": "application/json",
            ...(accessToken && {
              Authorization: `Bearer ${accessToken}`,
            }),
            ...(host && {
              "X-Mtm-Host": host,
            }),
          },
        });
        return response;
      },
    });
  }, [serverUrl, accessToken, host]);
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryStreamedHydration>
        <MtErrorBoundary>{children}</MtErrorBoundary>
      </ReactQueryStreamedHydration>
      {/* <ReactQueryDevtools /> */}
    </QueryClientProvider>
  );
}
