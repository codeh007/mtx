import type { EmailAgent } from "../../agents/email";
import type { MyMCP } from "../../agents/mcp-agent";
import type { MockEmailService } from "../../agents/mock-email";
import type { Scheduler } from "../../agents/scheduler";
import type { Stateful } from "../../agents/stateful";
// import { env } from "cloudflare:workers";

export type Env = {
  Scheduler: DurableObjectNamespace<Scheduler>;
  Stateful: DurableObjectNamespace<Stateful>;
  Email: DurableObjectNamespace<EmailAgent>;
  MockEmailService: DurableObjectNamespace<MockEmailService<Env>>;
  MyMCP: DurableObjectNamespace<MyMCP>;
  OPENAI_API_KEY: string;
};
