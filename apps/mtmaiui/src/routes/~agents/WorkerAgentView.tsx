"use client";

import { useAgent } from "agents/react";
import { useWorkbenchStore } from "../../stores/workbrench.store";

export function WorkerAgentView() {
  const agentUrl = useWorkbenchStore((state) => state.agentUrl);
  const agentHost = new URL(agentUrl).host;
  const agentPathPrefix = useWorkbenchStore((state) => state.agentPathPrefix);
  const workerAgent = useAgent({
    agent: "worker",
    id: "default",
    host: agentHost,
    prefix: agentPathPrefix,
  });
  return (
    <div className="w-1/4">
      <div>worker agent view</div>
      <div>worker agent view</div>
      <div>worker agent view</div>
    </div>
  );
}
