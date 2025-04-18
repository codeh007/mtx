"use client";
import { RouterProvider } from "@tanstack/react-router";
import { useMemo } from "react";
import { getQueryClient } from "./lib/get-query-client";
import { createRouter } from "./router";
import { MtmaiProvider } from "./stores/StoreProvider";
import { UIProviders } from "./stores/UIProviders";

export function App() {
  const mainRouter = useMemo(() => {
    return createRouter();
  }, []);

  const ctx = {
    tid: "",
    queryClient: getQueryClient(),
  };
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
          <div className="flex flex-col min-h-screen h-full w-full">
            {/* <WebLayoutHeader /> */}
            {/* {children} */}
            <RouterProvider router={mainRouter} context={ctx} />
          </div>
        </UIProviders>
      </MtmaiProvider>
    </>
  );
}
