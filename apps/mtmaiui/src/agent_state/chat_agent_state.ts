import type { LogMessage, MessageRunSchedule, ScheduleMessage } from "./shared";

export const AgentNames = {
  shortVideoAg: "short-video-ag",
} as const;

export interface AgentStateBase {
  lastUpdated: number;
  error?: string;
  enabledDebug?: boolean;
  // 子 agent, 让前端可以判断和显示子 agent 视图
  subAgents: Record<string, string>;
}
export interface ChatAgentState extends AgentStateBase {}

export type ChatAgentIncomingMessage = {
  type: "new_chat_participant";
  data: {
    agentName: string;
  };
};

export type ChatAgentOutgoingMessage =
  | NewChatParticipantMessage
  | LogMessage
  | MessageRunSchedule
  | ScheduleMessage;

export type NewChatParticipantMessage = {
  type: "new_chat_participant";
  data: {
    agentName: string;
  };
};
