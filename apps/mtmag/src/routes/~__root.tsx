"use client";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext } from "@tanstack/react-router";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { NotFound } from "../components/notFound";

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
    <>
      <MtSuspenseBoundary>
        {/* <UserFAB /> */}
        {/* <Outlet /> */}
        hello123 mtmag
      </MtSuspenseBoundary>
    </>
  );
}
