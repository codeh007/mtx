import { createLazyFileRoute } from "@tanstack/react-router";
import { TeamBuilder } from "../../../components/autogen_views/team/builder/builder";

export const Route = createLazyFileRoute("/coms/$comId/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <TeamBuilder />
    </>
  );
}
