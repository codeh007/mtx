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

export const Route = createLazyFileRoute("/chat/$sessionId/team")({
  component: RouteComponent,
});

function RouteComponent() {
  const tid = useTenantId();
  const chatId = useWorkbenchStore((x) => x.threadId);
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

  const agState = agStateQuery.data.state as AgStateProperties;
  return (
    <div className="bg-blug-200 p-2">
      team view
      <DebugValue title="agState" data={{ state: agStateQuery.data }} />
      <div>
        <div>state id: {agStateQuery.data?.metadata?.id}</div>
        {agState && agState.type === "TeamState" && (
          <MtSuspenseBoundary>
            <TeamView agState={agState} />
          </MtSuspenseBoundary>
        )}
      </div>
    </div>
  );
}

interface TeamViewProps {
  agState: AgStateProperties;
}
const TeamView = ({ agState }: TeamViewProps) => {
  const tid = useTenantId();
  // const state = agState.state as any;
  const componsenQuery = useSuspenseQuery({
    ...comsGetOptions({
      path: {
        tenant: tid,
      },
      query: {
        com: agState.teamId,
      },
    }),
  });
  return (
    <div className="bg-amber-100 p-1">
      {/* teamId: {agState.metadata?.id} */}
      <div>type: {agState.type}</div>
      <div>team_id: {agState.teamId}</div>
      <DebugValue title="team_component" data={{ agState: agState }} />
      <DebugValue title="team_component" data={{ coms: componsenQuery.data }} />
    </div>
  );
};
