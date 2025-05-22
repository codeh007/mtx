"use client";
import { RouterProvider } from "@tanstack/react-router";
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
