import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/coms/$comId/type/assisant")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/coms/$comId/type/assisant"!</div>;
}
