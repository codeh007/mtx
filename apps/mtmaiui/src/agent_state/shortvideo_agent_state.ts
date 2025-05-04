import type { LogMessage, MessageRunSchedule, ScheduleMessage } from "./shared";

export type ShortVideoAgentState = {
  // 其他相关 api 断点
  tts_api_endpoint: string;

  // 短视频生成相关
  video_subject: string;
};

export type ShortVideoInMessage = {
  type: "new_chat_participant";
  data: {
    agentName: string;
  };
};

export type ShortVideoOutMessage = LogMessage | MessageRunSchedule | ScheduleMessage;
