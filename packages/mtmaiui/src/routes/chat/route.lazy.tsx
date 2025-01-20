import { createLazyFileRoute } from "@tanstack/react-router";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import NoSSRWrapper from "mtxuilib/components/NoSSRWrapper";
import { Canvas } from "../../components/opencanvas/canvas/canvas";
import { useTenant } from "../../hooks/useAuth";
import { GraphProvider } from "../../stores/GraphContext";
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
    <div className="w-full h-full bg-blue-200">
      <NoSSRWrapper>
        <GraphProvider agentEndpointBase={selfBackendend!} tenant={tenant!}>
          <MtSuspenseBoundary>
            <Canvas />
          </MtSuspenseBoundary>
        </GraphProvider>
      </NoSSRWrapper>
    </div>
  );
}
