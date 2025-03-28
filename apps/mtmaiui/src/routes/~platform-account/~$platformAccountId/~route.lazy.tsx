"use client";
import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { PlatformAccountDetailHeader } from "./headers";
export const Route = createLazyFileRoute(
  "/platform-account/$platformAccountId",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { platformAccountId } = Route.useParams();
  return (
    <>
      <PlatformAccountDetailHeader id={platformAccountId} />
      <Outlet />
    </>
  );
}
