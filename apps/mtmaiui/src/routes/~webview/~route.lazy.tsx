import { Outlet, createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/webview")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      webview
      <Outlet />
    </>
  );
}
