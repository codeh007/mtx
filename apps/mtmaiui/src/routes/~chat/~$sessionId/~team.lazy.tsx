"use client";
import { createLazyFileRoute } from "@tanstack/react-router";

import { useSuspenseQuery } from "@tanstack/react-query";
import {
  type AgStateProperties,
  agStateGetOptions,
  comsGetOptions,
} from "mtmaiapi";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { useTenantId } from "../../../hooks/useAuth";
import { useWorkbenchStore } from "../../../stores/workbrench.store";
import { MtWorkbench } from "../MtWorkbench";

export const Route = createLazyFileRoute("/chat/$sessionId/team")({
  component: RouteComponent,
});

function RouteComponent() {
  const tid = useTenantId();
  const chatId = useWorkbenchStore((x) => x.threadId);
  const chatStarted = useWorkbenchStore((x) => x.chatStarted);
  const isStreaming = useWorkbenchStore((x) => x.isStreaming);
  const agStateQuery = useSuspenseQuery({
    ...agStateGetOptions({
      path: {
        tenant: tid,
      },
      query: {
        chat: chatId,
      },
    }),
  });

  const agState = agStateQuery.data as AgStateProperties;
  return (
    <div className="bg-blug-200 p-2">
      <div>type : {agState.type}</div>
      <DebugValue title="agState" data={{ state: agStateQuery.data }} />
      <div>
        <div>state id: {agStateQuery.data?.metadata?.id}</div>
        {/* {agState && agState.type === "TeamState" && ( */}
        <MtSuspenseBoundary>
          <MtWorkbench
            chatStarted={chatStarted}
            isStreaming={isStreaming}
            outlet={<TeamView agState={agState} />}
          />
        </MtSuspenseBoundary>
      </div>
    </div>
  );
}

interface TeamViewProps {
  agState: AgStateProperties;
}
const TeamView = ({ agState }: TeamViewProps) => {
  const tid = useTenantId();
  const componsenQuery = useSuspenseQuery({
    ...comsGetOptions({
      path: {
        tenant: tid,
      },
      query: {
        com: agState.componentId!,
      },
    }),
  });
  return (
    <div className="bg-amber-100 p-1">
      <div>type: {agState.type}</div>
      <div>componentId: {agState.componentId}</div>
      <DebugValue title="team_component" data={{ agState: agState }} />
      <DebugValue title="team_component" data={{ coms: componsenQuery.data }} />
    </div>
  );
};
