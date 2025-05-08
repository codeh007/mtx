import type { MainSenceSchema } from "mtremotion/types/constants";
import type { z } from "zod";
import type {
  AgentStateBase,
  LogMessage,
  MessageRunSchedule,
  ScheduleMessage,
} from "../../agent_state/shared";

export interface ShortVideoAgentState extends AgentStateBase {
  // 其他相关 api 端点
  mtmai_api_endpoint: string;
  // 短视频生成相关
  video_subject: string;
  mainSence: z.infer<typeof MainSenceSchema>;
}

// export const ShortVideoScencesSchema = z.array(SingleImageSenceSchema);
// export type ShortVideoScenes = z.infer<typeof ShortVideoScencesSchema>;

export type ShortVideoInMessage = ShortVideoTopicMessage | ShortVideoRunWorkflowMessage;

export type ShortVideoTopicMessage = {
  type: "shortvideo_topic";
  data: {
    topic: string;
  };
};

export type ShortVideoRunWorkflowMessage = {
  type: "run_workflow_shortvideo";
  data: {
    topic: string;
  };
};

export type ShortVideoOutMessage = LogMessage | MessageRunSchedule | ScheduleMessage;
