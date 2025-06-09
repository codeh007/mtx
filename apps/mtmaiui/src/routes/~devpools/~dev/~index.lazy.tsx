import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/devpools/dev/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/bot/"!</div>;
}
