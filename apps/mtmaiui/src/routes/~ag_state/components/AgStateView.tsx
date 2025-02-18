"use client";

import type { AgState } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";

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
