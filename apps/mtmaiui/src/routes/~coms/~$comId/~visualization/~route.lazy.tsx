import { createLazyFileRoute } from "@tanstack/react-router";
import { TeamBuilder } from "../../../components/views/team/builder/builder";

export const Route = createLazyFileRoute("/coms/$comId/visualization")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <TeamBuilder />
    </>
  );
}
