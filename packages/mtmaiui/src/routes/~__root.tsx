"use client";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { UserFAB } from "../components/UserFAB";
import { NotFound } from "../components/notFound";
import { onMount } from "./onMount";

if (typeof window !== "undefined") {
  onMount();
}
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
