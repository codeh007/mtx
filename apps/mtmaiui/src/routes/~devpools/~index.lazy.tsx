import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/devpools/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/devhosts/"!</div>;
}
