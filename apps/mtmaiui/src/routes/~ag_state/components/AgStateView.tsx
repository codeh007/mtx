"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { type AgState, agStateGetOptions } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { useTenantId } from "../../../hooks/useAuth";

interface AgStateView2Props {
  chatId: string;
}
export const AgStateView2 = ({ chatId }: AgStateView2Props) => {
  const tid = useTenantId();
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

  // const agStateQuery = useMtmQuery(AgService.method.getState, {
  //   id: agStateId,
  // });

  return (
    <div>
      <DebugValue title="agState" data={{ state: agStateQuery.data }} />
    </div>
  );
};

interface AgStateViewProps {
  agState: AgState;
}
export const AgStateView = ({ agState }: AgStateViewProps) => {
  const agStateData = agState.state as any;
  const stateData = agStateData.agent_states;
  return (
    <div>
      <h1>团队状态</h1>
      <DebugValue title="agState" data={{ state: agState }} />
      <div>
        <div>teamId: {agStateData.teamId}</div>
      </div>

      {Object.entries(stateData).map(([key, value]) => {
        return (
          <div key={key}>
            {key}: {JSON.stringify(value, null, 2)}
          </div>
        );
      })}
    </div>
  );
};
