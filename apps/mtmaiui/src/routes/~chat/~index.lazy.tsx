import { createLazyFileRoute } from "@tanstack/react-router";
import { Canvas } from "../../components/opencanvas/canvas";
import { useGraphStore } from "../../stores/GraphContext";

export const Route = createLazyFileRoute("/chat/")({
  component: RouteComponent,
});

function RouteComponent() {
  // const tenant = useTenant();
  // if (!tenant) {
  //   null;
  // }
  // const selfBackendend = useMtmaiV2((x) => x.selfBackendUrl);
  // if (!selfBackendend) {
  //   null;
  // }

  const setThreadId = useGraphStore((x) => x.setThreadId);
  setThreadId("");
  return (
    <>
      <Canvas />
    </>
  );
}
