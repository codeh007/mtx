import { createLazyFileRoute } from "@tanstack/react-router";
import { useTenant } from "../../hooks/useAuth";
import { useMtmaiV2 } from "../../stores/StoreProvider";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary.jsx";
import { Canvas } from "../../components/opencanvas/canvas";
import { GraphProvider } from "../../stores/GraphContext";

export const Route = createLazyFileRoute("/chat/")({
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
    <>
      {/* <div className="flex items-center justify-center h-full">
        No session selected. Create or select a session from the sidebar.
      </div> */}
      <MtSuspenseBoundary>
        <GraphProvider agentEndpointBase={selfBackendend!} tenant={tenant!}>
          <Canvas />
        </GraphProvider>
      </MtSuspenseBoundary>
    </>
  );
}
