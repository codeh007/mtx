import { createLazyFileRoute } from "@tanstack/react-router";
import { AdkSessionView } from "../AdkSessionView";
import { AdkEventsView } from "../AdkEventsView";

export const Route = createLazyFileRoute("/adk/session/$sessionId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { sessionId } = Route.useParams();

  return (
    <div>
      <AdkSessionView sessionId={sessionId} />

      <AdkEventsView sessionId={sessionId} />
    </div>
  );
}
