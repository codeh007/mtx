import type { LogMessage, MessageRunSchedule, ScheduleMessage } from "./shared";

export type ChatAgentState = {
  chatViewType: "full" | "mini";
  participants: string[];
  lastUpdated: number;
  error?: string;
};

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
