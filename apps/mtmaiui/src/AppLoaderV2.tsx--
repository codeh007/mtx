"use client";

import { RouterProvider } from "@tanstack/react-router";
import { getQueryClient } from "./lib/get-query-client";
import { createRouter } from "./router";
export function MtmClientAppV2({ serverUrl }: { serverUrl: string }) {
  if (typeof window === "undefined") {
    return null;
  }
  return (
    <>
      <RouterProvider
        router={createRouter({ serverUrl })}
        context={{
          serverUrl: serverUrl,
          queryClient: getQueryClient(),
        }}
      />
    </>
  );
}
