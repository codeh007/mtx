"use client";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { UserFAB } from "../components/UserFAB";
import { NotFound } from "../components/notFound";

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFound,
});

function RootComponent() {
  return (
    <>
      <UserFAB />
      <Outlet />
    </>
  );
}
