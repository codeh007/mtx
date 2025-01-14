import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dash/site/$siteId")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/dash/site/$siteId"!</div>;
}
