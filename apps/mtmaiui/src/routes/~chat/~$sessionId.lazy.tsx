import { createLazyFileRoute } from "@tanstack/react-router";
import { useGraphStore } from "../../stores/GraphContext";
import { Canvas } from "./components/canvas";

export const Route = createLazyFileRoute("/chat/$sessionId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { sessionId } = Route.useParams();
  const setThreadId = useGraphStore((x) => x.setThreadId);
  setThreadId(sessionId);
  return <Canvas />;
}
