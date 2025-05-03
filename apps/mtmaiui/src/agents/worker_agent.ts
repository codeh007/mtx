import { Agent } from "agents";

/**
 * 管理多个 worker 状态
 * 并且对接 聊天客户端 UI
 */
export class WorkerAgent extends Agent<Env> {
  initialState = {
    totalWorkers: 0,
  };
}
