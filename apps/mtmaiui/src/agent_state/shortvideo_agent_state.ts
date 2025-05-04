import type { LogMessage, MessageRunSchedule, ScheduleMessage } from "./shared";

export type ShortVideoAgentState = {
  // 其他相关 api 断点
  mtmai_api_endpoint: string;
  // 短视频生成相关
  video_subject: string;
};

export type ShortVideoInMessage = ShortVideoTopicMessage;

export type ShortVideoTopicMessage = {
  type: "shortvideo_topic";
  data: {
    topic: string;
  };
};

export type ShortVideoOutMessage = LogMessage | MessageRunSchedule | ScheduleMessage;
