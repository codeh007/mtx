"use client";

import type {
  AgState,
  AgentStates,
  ChatAgentContainerState,
  SocialTeamManagerState,
} from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";

interface RuntimeStateViewProps {
  state: AgState;
}
export const AgStateView = ({ state }: RuntimeStateViewProps) => {
  const state2 = state.state;
  const agentStates = state2.agent_states as any;

  const keys = Object.keys(agentStates);

  const objects = keys.map((key) => {
    return {
      key,
      value: agentStates[key],
    };
  });

  return (
    <div className="flex flex-col gap-2 space-y-2">
      {objects.map((x) => (
        <AgentStateView key={x.key} agentState={x.value} />
      ))}
    </div>
  );
};

const AgentStateView = ({ agentState }: { agentState: AgentStates }) => {
  return (
    <div className="bg-blue-100 p-2 rounded-md">
      {agentState.type === "ChatAgentContainerState" ? (
        <AssistantAgentStateView state={agentState} />
      ) : agentState.type === "SocialTeamManagerState" ? (
        <SocialTeamManagerStateView state={agentState} />
      ) : (
        <div>
          unknown agent state type <DebugValue data={agentState} />
        </div>
      )}
    </div>
  );
};

interface AssistantAgentStateViewProps {
  state: ChatAgentContainerState;
}
const AssistantAgentStateView = ({ state }: AssistantAgentStateViewProps) => {
  return (
    <div className="bg-yellow-100 p-2 rounded-md">
      AssistantAgentStateView
      <DebugValue data={state} />
    </div>
  );
};

interface SocialTeamManagerStateViewProps {
  state: SocialTeamManagerState;
}
const SocialTeamManagerStateView = ({
  state,
}: SocialTeamManagerStateViewProps) => {
  return (
    <div className="bg-green-100 p-2 rounded-md">
      SocialTeamManagerStateView
      <DebugValue data={state} />
    </div>
  );
};
