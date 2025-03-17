import { createLazyFileRoute } from "@tanstack/react-router";
import {
  type AssistantAgentState,
  type ChatAgentContainerState,
  type RoundRobinManagerState,
  StateType,
  type TeamState,
} from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { useWorkbenchStore } from "../../../../stores/workbrench.store";

export const Route = createLazyFileRoute("/session/$sessionId/state/")({
  component: RouteComponent,
});

function RouteComponent() {
  const agState = useWorkbenchStore((x) => x.teamState);
  const hello1 = () => {
    if (agState?.state?.type === StateType.TEAM_STATE) {
      const teamState = agState.state as TeamState;
    }
  };
  return (
    <div>
      <DebugValue data={{ agState }} />
      {agState?.state?.type === StateType.TEAM_STATE && (
        <TeamStateView teamState={agState.state as TeamState} />
      )}
    </div>
  );
}

const TeamStateView = ({ teamState }: { teamState: TeamState }) => {
  return (
    <div className="flex flex-col gap-2">
      {Object.entries(
        teamState?.agent_states as Record<string, ChatAgentContainerState>,
      ).map(([key, value]) => {
        if (value.type === StateType.CHAT_AGENT_CONTAINER_STATE) {
          return <ChatAgentContainerStateView key={key} agentState={value} />;
        }
        if (value.type === StateType.ROUND_ROBIN_MANAGER_STATE) {
          return (
            <RoundRobinManagerStateView
              key={key}
              roundRobinManagerState={value}
            />
          );
        }
        return (
          <div key={key} className="bg-red-100">
            unknown state type: key: {key} type: {value.type}{" "}
            <span>{StateType.CHAT_AGENT_CONTAINER_STATE}</span>
          </div>
        );
      })}
    </div>
  );
};

const ChatAgentContainerStateView = ({
  agentState,
}: { agentState: ChatAgentContainerState }) => {
  if (!agentState?.agent_state) return null;

  const stateData = agentState.agent_state as any;
  return (
    <div className="flex flex-col gap-2 bg-gray-100 p-2 rounded-md">
      <div className="text-sm font-bold">ChatAgentContainerStateView</div>
      <DebugValue data={agentState} />
      <AgentStateView agentState={stateData} />
    </div>
  );
};
const AgentStateView = ({ agentState }: { agentState: any }) => {
  switch (agentState.type) {
    case StateType.ASSISTANT_AGENT_STATE:
      return <AssistantAgentStateView assistantAgentState={agentState} />;
    case StateType.CHAT_AGENT_CONTAINER_STATE:
      return <ChatAgentContainerStateView agentState={agentState} />;
    default:
      return (<div>unknown agent state type: {agentState.type}</div>)
  }
};

const RoundRobinManagerStateView = ({
  roundRobinManagerState,
}: { roundRobinManagerState: RoundRobinManagerState }) => {
  return (
    <div className="flex flex-col gap-2 bg-gray-200 p-2 rounded-md">
      <div className="text-sm font-bold">RoundRobinManagerStateView</div>
      <DebugValue data={{ roundRobinManagerState }} />
    </div>
  );
};

const AssistantAgentStateView = ({
  assistantAgentState,
}: { assistantAgentState: AssistantAgentState }) => {
  return (
    <div className="flex flex-col gap-2 bg-yellow-500 p-2 rounded-md">
      <div className="text-sm font-bold">AssistantAgentStateView</div>
      <DebugValue data={{ assistantAgentState }} />
    </div>
  );
};
