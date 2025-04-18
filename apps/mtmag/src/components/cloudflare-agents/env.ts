import type { DemoMcpServer } from "../../agents/demoMcpServer";
import type { EmailAgent } from "../../agents/email";
import type { MockEmailService } from "../../agents/mock-email";
import type { Scheduler } from "../../agents/scheduler";
import type { Stateful } from "../../agents/stateful";
// import { env } from "cloudflare:workers";

export type Env = {
  Scheduler: DurableObjectNamespace<Scheduler>;
  Stateful: DurableObjectNamespace<Stateful>;
  Email: DurableObjectNamespace<EmailAgent>;
  MockEmailService: DurableObjectNamespace<MockEmailService<Env>>;
  DemoMcpServer: DurableObjectNamespace<DemoMcpServer>;
  OPENAI_API_KEY: string;
  HYPERDRIVE: Hyperdrive;
};
