import { createLazyFileRoute } from "@tanstack/react-router";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { useTeamBuilderStore } from "../../../stores/teamBuildStore";

export const Route = createLazyFileRoute("/coms/$comId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const team = useTeamBuilderStore((x) => x.team);
  return (
    <>
      <DebugValue data={team} />
    </>
  );
}
