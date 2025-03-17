import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { useParams } from "../../../../hooks/useNav";
import { TeamSessionProvider } from "../../../../stores/teamSessionProvider";
import { TeamSessionHeader } from "./header.lazy";

export const Route = createLazyFileRoute("/coms/$comId/new_session")({
  component: RouteComponent,
});

function RouteComponent() {
  const { comId } = useParams();
  return (
    <TeamSessionProvider componentId={comId}>
      <TeamSessionHeader componentId={comId} />
      <Outlet />
    </TeamSessionProvider>
  );
}
