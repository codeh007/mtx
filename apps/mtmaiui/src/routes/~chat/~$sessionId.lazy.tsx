import { createLazyFileRoute } from "@tanstack/react-router";
import { Canvas } from "../../components/opencanvas/canvas";
import { useGraphStore } from "../../stores/GraphContext";

export const Route = createLazyFileRoute("/chat/$sessionId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { sessionId } = Route.useParams();

  // const tenant = useTenant()
  // if (!tenant) {
  //   null
  // }
  // const selfBackendend = useMtmaiV2((x) => x.selfBackendUrl)
  // if (!selfBackendend) {
  //   null
  // }
  const setThreadId = useGraphStore((x) => x.setThreadId);
  setThreadId(sessionId);
  return (
    // <GraphProvider
    //   agentEndpointBase={selfBackendend!}
    //   tenant={tenant!}
    //   threadId={sessionId}
    // >
    <Canvas />
    // </GraphProvider>
  );
}
