import { createLazyFileRoute } from "@tanstack/react-router";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { useTenant } from "../../hooks/useAuth";
import { Canvas } from "../../opencanvasv2/canvas/canvas";
import { GraphV2Provider } from "../../stores/GraphContextV2";
import { useMtmaiV2 } from "../../stores/StoreProvider";

export const Route = createLazyFileRoute("/chat")({
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
    <div className="w-full h-full bg-blue-200 p-2">
      <GraphV2Provider agentEndpointBase={selfBackendend!} tenant={tenant!}>
        <MtSuspenseBoundary>
          <Canvas />
        </MtSuspenseBoundary>
      </GraphV2Provider>
    </div>
  );
}
