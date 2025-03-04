"use client";
import { createLazyFileRoute } from "@tanstack/react-router";

import { useSuspenseQuery } from "@tanstack/react-query";
import {
  type AgStateProperties,
  agStateGetOptions,
  comsGetOptions,
} from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { useTenantId } from "../../../../hooks/useAuth";
import { useWorkbenchStore } from "../../../../stores/workbrench.store";

export const Route = createLazyFileRoute("/play/chat/$sessionId/state")({
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

  const agState = agStateQuery.data as AgStateProperties;
  return (
    <div className="bg-blug-200 p-2">
      <div>type : {agState.type}</div>
      <DebugValue title="agState" data={{ state: agStateQuery.data }} />
      <div>
        <div>state id: {agStateQuery.data?.metadata?.id}</div>
        <TeamView agState={agState} />
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
    <div className="bg-amber-200 p-1">
      <div>type: {agState.type}</div>
      <DebugValue
        title="team state"
        data={{ agState: agState, coms: componsenQuery.data }}
      />
    </div>
  );
};
