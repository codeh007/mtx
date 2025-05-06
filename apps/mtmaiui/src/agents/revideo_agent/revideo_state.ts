import type { LogMessage, MessageRunSchedule, ScheduleMessage } from "../../agent_state/shared";

export type ShortVideoAgentState = {
  // 其他相关 api 断点
  mtmai_api_endpoint: string;
  // 短视频生成相关
  video_subject: string;
};

export type RevideoInMessage = RevideoTopicMessage | RevideoRunWorkflowMessage;

export type RevideoTopicMessage = {
  type: "revideo_topic";
  data: {
    topic: string;
  };
};

export type RevideoRunWorkflowMessage = {
  type: "run_workflow_revideo";
  data: {
    topic: string;
  };
};

export type RevideoOutMessage = LogMessage | MessageRunSchedule | ScheduleMessage;
