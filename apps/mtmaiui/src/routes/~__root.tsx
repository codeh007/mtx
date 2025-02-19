"use client";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { UserFAB } from "../components/UserFAB";
import { NotFound } from "../components/notFound";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFound,
});

function RootComponent() {
  return (
    <>
    <MtSuspenseBoundary>
      <UserFAB />
      <Outlet />
      </MtSuspenseBoundary>
    </>
  );
}
