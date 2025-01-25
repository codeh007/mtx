import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/endpoint/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/endpoint/"!</div>;
}
