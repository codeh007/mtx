import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/adk/session/$sessionId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { sessionId } = Route.useParams();
  return (
    <div>
      adk/session {sessionId}
      <AdkStateView />
    </div>
  );
}

const AdkStateView = () => {
  return <div>AdkStateView</div>;
};
