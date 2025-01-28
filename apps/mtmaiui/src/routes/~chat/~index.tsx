import { createFileRoute } from "@tanstack/react-router";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { Canvas } from "../../components/opencanvas/canvas";
import { useTenant } from "../../hooks/useAuth";
import { GraphProvider } from "../../stores/GraphContext";
import { useMtmaiV2 } from "../../stores/StoreProvider";

export const Route = createFileRoute("/chat/")({
  component: RouteComponent,
});

function RouteComponent() {
  const tenant = useTenant();
  const selfBackendend = useMtmaiV2((x) => x.selfBackendUrl);
  if (!tenant) {
    null;
  }
  if (!selfBackendend) {
    null;
  }
  return (
    <MtSuspenseBoundary>
      <GraphProvider agentEndpointBase={selfBackendend!} tenant={tenant!}>
        <Canvas />
      </GraphProvider>
    </MtSuspenseBoundary>
  );
}
