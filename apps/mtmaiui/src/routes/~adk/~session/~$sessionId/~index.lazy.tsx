import { createLazyFileRoute } from "@tanstack/react-router";
import { AdkSessionView } from "../AdkSessionView";

export const Route = createLazyFileRoute("/adk/session/$sessionId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { sessionId } = Route.useParams();

  return (
    <div>
      <AdkSessionView sessionId={sessionId} />
    </div>
  );
}
