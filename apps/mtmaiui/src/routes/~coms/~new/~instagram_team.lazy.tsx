import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/coms/new/instagram_team")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>新建: instagram team</div>;
}
