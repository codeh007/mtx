"use client";
import type { QueryClient } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { UserFAB } from "../components/UserFAB";
import { NotFound } from "../components/notFound";
import { SessionProvider } from "../lib/auth_hono/react";
// import appCss from "../styles/app.css?url"

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
    // links: [
    //   {
    //     rel: "stylesheet",
    //     href: appCss,
    //   },
    // ],
  }),
});

export const RootRoute = Route;
// export const Route = createRootRoute({
//   head: () => ({
//     meta: [
//       {
//         charSet: "utf-8",
//       },
//       {
//         name: "viewport",
//         content: "width=device-width, initial-scale=1",
//       },
//       {
//         title: "TanStack Start Starter",
//       },
//     ],
//     // links: [
//     //   {
//     //     rel: "stylesheet",
//     //     href: appCss,
//     //   },
//     // ],
//   }),
//   component: RootComponent,
//   notFoundComponent: NotFound,
// });

function RootComponent() {
  return (
    <>
      <MtSuspenseBoundary>
        <SessionProvider basePath="/api/auth">
          <UserFAB />
          <Outlet />
        </SessionProvider>
      </MtSuspenseBoundary>
    </>
  );
}
