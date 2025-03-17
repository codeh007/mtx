import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/coms/$comId/")({
  component: RouteComponent,
});

function RouteComponent() {
  // const team = useTeamBuilderStore((x) => x.team);
  return <></>;
}
