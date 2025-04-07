"use client";
import { createLazyFileRoute } from "@tanstack/react-router";

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { agStateGetOptions, type AgStateProperties, comsGetOptions } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { useTenantId } from "../../../../hooks/useAuth";

export const Route = createLazyFileRoute("/play/chat/$sessionId/state")({
  component: RouteComponent,
});

function RouteComponent() {
  const tid = useTenantId();
  const { sessionId } = Route.useParams();
  // const agStateQuery = useTeamStateQuery({ chatId: sessionId });
  const agStateQuery = useQuery({
    ...agStateGetOptions({
      path: {
        tenant: tid,
      },
      query: {
        chat: sessionId,
      },
    }),
  });

  const agState = agStateQuery.data as AgStateProperties;
  return (
    <div className="bg-blue-200 p-2">
      {agState && (
        <>
          <div>type : {agState.type}</div>
          <DebugValue title="agState" data={{ state: agStateQuery.data }} />
          <div>
            <div>state id: {agStateQuery.data?.metadata?.id}</div>
            <TeamView agState={agState} />
          </div>
        </>
      )}
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
      {agState && (
        <>
          <div>type: {agState.type}</div>
          <DebugValue
            title="team state"
            data={{ agState: agState, coms: componsenQuery.data }}
          />
        </>
      )}
    </div>
  );
};
