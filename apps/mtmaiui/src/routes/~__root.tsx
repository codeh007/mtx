"use client";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { UserFAB } from "../components/UserFAB";
import { NotFound } from "../components/notFound";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import appCss from "../styles/app.css?url"
export const Route = createRootRoute({
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
        title: "TanStack Start Starter",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFound,
});

function RootComponent() {
  return (
    <>
    <MtSuspenseBoundary>
      {/* <UserFAB /> */}
      {/* <Outlet /> */}
      </MtSuspenseBoundary>
    </>
  );
}
