import postgres from "postgres";
import { Chat } from "./agents/chat";
import { DemoMcpServer } from "./agents/demoMcpServer";
import { EmailAgent } from "./agents/email";
import { MyMcpAgent } from "./agents/mcp_agent";
import { MockEmailService } from "./agents/mock-email";
import { RootAg } from "./agents/root_ag";
import { Scheduler } from "./agents/scheduler";
import { Stateful } from "./agents/stateful";
import app from "./hono_app/app";
// import type { Env } from "./hono_app/core/env";
// import app from "mtxuilib/mcp_server/app";

export {
  RootAg,
  Chat,
  EmailAgent,
  MockEmailService,
  // Rpc,
  Scheduler,
  Stateful,
  MyMcpAgent,
  DemoMcpServer,
};

// Export the OAuth handler as the default
// const mcpServerHandler = new OAuthProvider({
//   apiRoute: "/sse",
//   // @ts-ignore
//   apiHandler: DemoMcpServer.mount("/sse", { cors: true }),
//   // @ts-ignore
//   defaultHandler: app,
//   authorizeEndpoint: "/authorize",
//   tokenEndpoint: "/token",
//   clientRegistrationEndpoint: "/register",
// });

async function helloPostgresHandler(env: Env, ctx: ExecutionContext) {
  const sql = postgres(env.HYPERDRIVE.connectionString, {
    max: 5,
    fetch_types: false,
  });

  try {
    const result = await sql`select * from pg_tables LIMIT 10`;
    ctx.waitUntil(sql.end());
    return Response.json({ result: result });
  } catch (e: any) {
    console.log(e);
    return Response.json({ error: e.message }, { status: 500 });
  }
}

const handler = DemoMcpServer.mount("/sse", { binding: "DemoMcpServer" });

export default {
  fetch: app.fetch,
  scheduled: async (batch, env) => {},
} satisfies ExportedHandler<Env>;
