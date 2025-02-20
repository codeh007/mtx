import { createLazyFileRoute } from "@tanstack/react-router";
import { useGraphStore } from "../../stores/GraphContext";
import { Canvas } from "./components/canvas";

export const Route = createLazyFileRoute("/chat/")({
  component: RouteComponent,
});

function RouteComponent() {
  const setThreadId = useGraphStore((x) => x.setThreadId);
  setThreadId("");
  return (
    <>
      <Canvas />
    </>
  );
}
