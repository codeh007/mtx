"use client";
import { RouterProvider } from "@tanstack/react-router";
import { useMemo } from "react";
import { getQueryClient } from "./lib/get-query-client";
import { createRouter } from "./router";

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
      fffapp
      {/* <MtmaiProvider
      >
        <UIProviders>
          <div className="flex flex-col min-h-screen h-full w-full">
            <RouterProvider router={mainRouter} context={ctx} />
          </div>
        </UIProviders>
      </MtmaiProvider> */}
      <RouterProvider router={mainRouter} context={ctx} />
    </>
  );
}
