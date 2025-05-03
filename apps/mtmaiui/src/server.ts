import { Chat } from "./agents/chat";
import { DemoMcpServer } from "./agents/demoMcpServer";
import { EmailAgent } from "./agents/email";
import { MyMcpAgent } from "./agents/mcp_agent";
import { RootAg } from "./agents/root_ag";
import { Scheduler } from "./agents/scheduler";
import { WorkerAgent } from "./agents/worker_agent";
import app from "./hono_app/app";

export { RootAg, Chat, EmailAgent, Scheduler, WorkerAgent, MyMcpAgent, DemoMcpServer };

export default {
  fetch: app.fetch,
  scheduled: async (batch, env) => {},
} satisfies ExportedHandler<Env>;
