import { createLazyFileRoute } from "@tanstack/react-router";
import { useWorkbenchStore } from "../../stores/workbrench.store";
import { Canvas } from "./components/canvas";

export const Route = createLazyFileRoute("/chat/$sessionId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { sessionId } = Route.useParams();
  const setThreadId = useWorkbenchStore((x) => x.setThreadId);
  setThreadId(sessionId);
  return <Canvas />;
}
