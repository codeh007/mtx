import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/proxy/new")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/proxy/new"!</div>;
}
