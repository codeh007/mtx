"use client";
import type { QueryClient } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { NotFound } from "../components/notFound";
import { MtmaiProvider } from "../stores/StoreProvider";

interface MyRouterContext {
  tid: string;
  queryClient: QueryClient;
}

// Use the routerContext to create your root route
export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
  notFoundComponent: NotFound,
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "MtmAI UI",
      },
    ],
  }),
});

function RootComponent() {
  return (
    <MtSuspenseBoundary>
      <MtmaiProvider>
        <Outlet />
      </MtmaiProvider>
    </MtSuspenseBoundary>
  );
}
