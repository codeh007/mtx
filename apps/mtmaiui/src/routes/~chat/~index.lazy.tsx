import { createLazyFileRoute } from "@tanstack/react-router";
import { Canvas } from "./components/canvas";
import { useWorkbenchStore } from "../../stores/workbrench.store";

export const Route = createLazyFileRoute("/chat/")({
  component: RouteComponent,
});

function RouteComponent() {
  const setThreadId = useWorkbenchStore((x) => x.setThreadId);
  setThreadId("");
  return (
    <>
      <Canvas />
    </>
  );
}
