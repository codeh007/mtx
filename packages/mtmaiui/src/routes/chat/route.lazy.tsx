import { createLazyFileRoute } from "@tanstack/react-router";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { useTenant } from "../../hooks/useAuth";
import { Canvas } from "../../opencanvasv2/canvas/canvas";
import { GraphV2Provider } from "../../stores/GraphContextV2";

export const Route = createLazyFileRoute("/chat")({
  component: RouteComponent,
});

function RouteComponent() {
  const tenant = useTenant();

  if (!tenant) {
    null;
  }
  return (
    <div className="w-full h-full bg-blue-200 p-2">
      <GraphV2Provider
        agentEndpointBase="https://colab-gomtm.yuepa8.com"
        tenant={tenant}
      >
        <MtSuspenseBoundary>
          <Canvas />
        </MtSuspenseBoundary>
      </GraphV2Provider>
    </div>
  );
}
