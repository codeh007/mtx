"use client";
import { useTenantId } from "@mtmaiui/hooks/useAuth";
import type { QueryClient } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { UserFAB } from "../components/UserFAB";
import { NotFound } from "../components/notFound";
import { Header } from "./Header";

interface MyRouterContext {
  queryClient: QueryClient;
  serverUrl: string;
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

export const RootRoute = Route;

function RootComponent() {
  const tid = useTenantId();
  const isInDash = window.location.pathname?.startsWith("/dash");
  return (
    <>
      {isInDash && <Header />}
      <UserFAB />
      <Outlet />
    </>
  );
}
