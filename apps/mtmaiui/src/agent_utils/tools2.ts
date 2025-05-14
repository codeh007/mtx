import type { Agent, Schedule } from "agents";
import { unstable_getSchedulePrompt, unstable_scheduleSchema } from "agents/schedule";
import { generateObject, tool } from "ai";
import { z } from "zod";
import { getDefaultModel } from "../components/cloudflare-agents/model";
import { taskmq_submit } from "./dbfn/taskmq_submit";

export function toolSmolagent(env: Env) {
  return {
    smolagent: tool({
      description: "运行 python 代码,解决复杂问题的agent",
      parameters: z.object({
        task: z.string().describe(`任务描述,例子1:如何生成一个短视频,
          例子2: 289.882乘以180.34减去3098.120, 结果保留两位小数,最终结果是多少?
          `),
      }),
      execute: async ({ task }) => {
        try {
          return taskmq_submit(env.HYPERDRIVE.connectionString, "smolagent", task);
        } catch (e: any) {
          return { error: e.message, stack: e.stack };
        }
      },
    }),
  };
}

export function toolGenShortVideo(env: Env) {
  return {
    genShortVideo: tool({
      description: "生成短视频",
      parameters: z.object({
        topic: z.string().describe("短视频主题"),
      }),
      execute: async ({ topic }) => {
        try {
          //   let shortAgId = this.state.subAgents?.[AgentNames.shortVideoAg];
          //   if (!shortAgId) {
          //     shortAgId = generateId();
          //   }
          //   const shortVideoAgent = await getAgentByName<Env, ShortVideoAg>(
          //     this.env.ShortVideoAg,
          //     shortAgId,
          //   );
          //   this.setState({
          //     ...this.state,
          //     subAgents: {
          //       ...this.state.subAgents,
          //       [AgentNames.shortVideoAg]: shortAgId,
          //     },
          //   });
          //   // ! Fixme: 工具调用,应尽可能返回文本
          //   const result = await shortVideoAgent.onGenShortVideo(topic);
          //   return result;
          return "功能未实现";
        } catch (e: any) {
          console.error("toolGenShortVideo error", e);
          return `运行出错: ${e.message}, ${e.stack}`;
        }
      },
    }),
  };
}

export function toolSchedule(
  env: Env,
  agent: Agent<Env>,
  callback: (schedule: Schedule<string>) => void,
  task: string,
) {
  return {
    schedule: tool({
      description: "生成计划任务",
      parameters: z.object({
        task: z.string().describe("任务描述"),
      }),
      execute: async ({ task }) => {
        try {
          // return "功能未实现";
          const model = getDefaultModel(env);
          const result = await generateObject({
            model,
            mode: "json",
            schemaName: "task",
            schemaDescription: "A task to be scheduled",
            schema: unstable_scheduleSchema, // <- the shape of the object that the scheduler expects
            maxRetries: 5,
            prompt: `${unstable_getSchedulePrompt({
              date: new Date(),
            })} 
  Input to parse: "${task}"`,
          });
          const scheduleObject = result.object;
          if (scheduleObject.when.type === "no-schedule") {
            // connection.send(
            //   JSON.stringify({
            //     type: "error",
            //     data: `No schedule provided for ${event.input}`,
            //   } satisfies OutgoingMessage),
            // );
            return;
          }
          // callback(scheduleObject);

          // 将任务安排放到队列
          const schedule = await agent.schedule(
            scheduleObject.when.type === "scheduled"
              ? scheduleObject.when.date!
              : scheduleObject.when.type === "delayed"
                ? scheduleObject.when.delayInSeconds!
                : scheduleObject.when.cron!,
            "onTask",
            scheduleObject.description,
          );
        } catch (e: any) {
          console.error("toolSchedule error", e);
          return `运行出错: ${e.message}, ${e.stack}`;
        }
      },
    }),
  };
}

/**未完成 */
export function toolQueryTasksToRun(env: Env) {
  return {
    queryTasksToRun: tool({
      description: "查询需要执行的任务",
      parameters: z.object({
        // topic: z.string().describe("任务描述"),
      }),
      execute: async ({}) => {
        try {
          //   let shortAgId = this.state.subAgents?.[AgentNames.shortVideoAg];
          //   if (!shortAgId) {
          //     shortAgId = generateId();
          //   }
          //   const shortVideoAgent = await getAgentByName<Env, ShortVideoAg>(
          //     this.env.ShortVideoAg,
          //     shortAgId,
          //   );
          //   this.setState({
          //     ...this.state,
          //     subAgents: {
          //       ...this.state.subAgents,
          //       [AgentNames.shortVideoAg]: shortAgId,
          //     },
          //   });
          //   // ! Fixme: 工具调用,应尽可能返回文本
          //   const result = await shortVideoAgent.onGenShortVideo(topic);
          //   return result;
          return "暂时没有任务需要执行";
        } catch (e: any) {
          console.error("toolGenShortVideo error", e);
          return `运行出错: ${e.message}, ${e.stack}`;
        }
      },
    }),
  };
}
