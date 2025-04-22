import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/adk/session/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>adk/session</div>;
}
