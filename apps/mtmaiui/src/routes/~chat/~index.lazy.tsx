import { createLazyFileRoute } from "@tanstack/react-router";
import { Canvas } from "../../components/opencanvas/canvas";
import { useTenant } from "../../hooks/useAuth";
import { GraphProvider } from "../../stores/GraphContext";
import { useMtmaiV2 } from "../../stores/StoreProvider";

export const Route = createLazyFileRoute("/chat/")({
  component: RouteComponent,
});

function RouteComponent() {
  const tenant = useTenant();
  if (!tenant) {
    null;
  }
  const selfBackendend = useMtmaiV2((x) => x.selfBackendUrl);
  if (!selfBackendend) {
    null;
  }
  return (
    <>
      <GraphProvider agentEndpointBase={selfBackendend!} tenant={tenant!}>
        <Canvas />
      </GraphProvider>
    </>
  );
}
