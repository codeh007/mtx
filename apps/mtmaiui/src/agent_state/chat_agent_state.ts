import type { AgentStateBase, LogMessage, MessageRunSchedule, ScheduleMessage } from "./shared";

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
