'use client';

import { AgentEvent, AssistantAgentState, ChatAgentContainerState, RoundRobinManagerState, StateType, TeamState } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";


export const TeamStateView = ({ teamState }: { teamState: TeamState }) => {
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
  
  export const ChatAgentContainerStateView = ({
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
export const AgentStateView = ({ agentState }: { agentState: any }) => {
    switch (agentState.type) {
      case StateType.ASSISTANT_AGENT_STATE:
        return <AssistantAgentStateView assistantAgentState={agentState} />;
      case StateType.CHAT_AGENT_CONTAINER_STATE:
        return <ChatAgentContainerStateView agentState={agentState} />;
      default:
        return (<div>unknown agent state type: {agentState.type}</div>)
    }
  };
  
export const RoundRobinManagerStateView = ({
    roundRobinManagerState,
  }: { roundRobinManagerState: RoundRobinManagerState }) => {
    return (
      <div className="flex flex-col gap-2 bg-slate-50 p-1 rounded-md">
        <div className="text-sm font-bold">RoundRobinManagerStateView</div>
        {/* <DebugValue data={{ roundRobinManagerState }} /> */}
        <ChatEventsView agentEvents={roundRobinManagerState.message_thread || []} />
      </div>
    );
  };
  
export const AssistantAgentStateView = ({
    assistantAgentState,
  }: { assistantAgentState: AssistantAgentState }) => {
    return (
      <div className="flex flex-col gap-2 bg-yellow-500 p-2 rounded-md">
        <div className="text-sm font-bold">AssistantAgentStateView</div>
        <DebugValue data={{ assistantAgentState }} />
      </div>
    );
  };
  
  
export const ChatEventsView = ({ agentEvents }: { agentEvents: AgentEvent[] }) => {
    return (
      <div className="flex flex-col gap-2 bg-blue-500 p-2 rounded-md">
        <div className="text-sm font-bold">ChatEventsView</div>
        <DebugValue data={{ agentEvents }} />
        {
          agentEvents.map((agentEvent, index) => {
            return (
              <div key={index} className="bg-slate-100 p-1 rounded-md">
                <DebugValue data={{ agentEvent }} />
                <div className="text-sm">{agentEvent.content}</div>
              </div>
            );
          })
        }
      </div>
    );
  };