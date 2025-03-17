import { createLazyFileRoute } from "@tanstack/react-router";
import {
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
    if (agState?.stateV2?.type === StateType.TEAM_STATE) {
      const teamState = agState.stateV2 as TeamState;
    }
  };
  return (
    <div>
      <DebugValue data={{ agState }} />
      {agState?.stateV2?.type === StateType.TEAM_STATE && (
        <TeamStateView teamState={agState.stateV2 as TeamState} />
      )}
    </div>
  );
}

const TeamStateView = ({ teamState }: { teamState: TeamState }) => {
  return (
    <div className="flex flex-col gap-2">
      {Object.entries(
        teamState.agent_states as Record<string, ChatAgentContainerState>,
      ).map(([key, value]) => {
        return <ChatAgentContainerStateView key={key} agentState={value} />;
      })}
    </div>
  );
};

const ChatAgentContainerStateView = ({
  agentState,
}: { agentState: ChatAgentContainerState }) => {
  return (
    <div className="flex flex-col gap-2 bg-gray-100 p-2 rounded-md">
      <div className="text-sm font-bold">ChatAgentContainerStateView</div>
      <DebugValue data={{ agentState }} />

      {Object.entries(
        (agentState.agent_state || agentState.agentState) as Record<
          string,
          any
        >,
      ).map(([key, value]) => {
        if (value.type === StateType.ROUND_ROBIN_MANAGER_STATE) {
          return (
            <RoundRobinManagerStateView
              key={key}
              roundRobinManagerState={value}
            />
          );
        }
        return (
          <div key={key} className="bg-red-100 ">
            {key}
          </div>
        );
      })}
    </div>
  );
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
