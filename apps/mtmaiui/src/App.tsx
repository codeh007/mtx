"use client";
import { RouterProvider } from "@tanstack/react-router";
import { getQueryClient } from "./lib/get-query-client";
import { createRouter } from "./router";
import { MtmaiProvider } from "./stores/StoreProvider";
import { UIProviders } from "./stores/UIProviders";

export function MtmClientApp() {
  return (
    <>
      <MtmaiProvider
      // frontendConfig={await getFrontendConfig()}
      // hostName={await getHostName()}
      // serverUrl={await getBackendUrl()}
      // selfBackendUrl={await getBackendUrl()}
      // accessToken={await getAccessToken()}
      >
        <UIProviders>
          {/* <div className="flex flex-col min-h-screen h-full w-full"> */}
          <RouterProvider
            router={createRouter()}
            context={{
              tid: "",
              queryClient: getQueryClient(),
            }}
          />
          {/* </div> */}
        </UIProviders>
      </MtmaiProvider>
    </>
  );
}
