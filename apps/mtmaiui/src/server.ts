import OAuthProvider from "@cloudflare/workers-oauth-provider";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { routeAgentRequest } from "agents";
import { McpAgent } from "agents/mcp";
import app from "mtxuilib/mcp_server/app.js";
import { z } from "zod";
import { Chat } from "./components/cloudflare-agents/agents/chat";
import { EmailAgent } from "./components/cloudflare-agents/agents/email";
import { MockEmailService } from "./components/cloudflare-agents/agents/mock-email";
import { Rpc } from "./components/cloudflare-agents/agents/rpc";
import { Scheduler } from "./components/cloudflare-agents/agents/scheduler";
import { Stateful } from "./components/cloudflare-agents/agents/stateful";

// import { env } from "cloudflare:workers";

export type Env = {
  Scheduler: DurableObjectNamespace<Scheduler>;
  Stateful: DurableObjectNamespace<Stateful>;
  Email: DurableObjectNamespace<EmailAgent>;
  MockEmailService: DurableObjectNamespace<MockEmailService<Env>>;
  OPENAI_API_KEY: string;
};
export { Chat, EmailAgent, MockEmailService, Rpc, Scheduler, Stateful };

export class MyMCP extends McpAgent {
  server = new McpServer({
    name: "Demo",
    version: "1.0.0",
  });

  async init() {
    this.server.tool(
      "add",
      { a: z.number(), b: z.number() },
      async ({ a, b }) => ({
        content: [{ type: "text", text: String(a + b) }],
      }),
    );
    this.server.resource("counter", "mcp://resource/counter", (uri) => {
      return {
        contents: [{ uri: uri.href, text: "hello123 resource" }],
      };
    });
    //export type PromptCallback<Args extends undefined | PromptArgsRawShape = undefined> = Args extends PromptArgsRawShape ? (args: z.objectOutputType<Args, ZodTypeAny>, extra: RequestHandlerExtra) => GetPromptResult | Promise<GetPromptResult> : (extra: RequestHandlerExtra) => GetPromptResult | Promise<GetPromptResult>;

    this.server.prompt("review-code", { code: z.string() }, ({ code }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Please review this code:\n\n${code}`,
          },
        },
      ],
    }));
  }
}

// Export the OAuth handler as the default
const mcpServerHandler = new OAuthProvider({
  apiRoute: "/sse",
  // TODO: fix these types
  // @ts-ignore
  apiHandler: MyMCP.mount("/sse"),
  // @ts-ignore
  defaultHandler: app,
  authorizeEndpoint: "/authorize",
  tokenEndpoint: "/token",
  clientRegistrationEndpoint: "/register",
});
// const model = openai("gpt-4o-2024-11-20");

// import { createWorkersAI } from 'workers-ai-provider';
// Cloudflare AI Gateway
// const openai = createOpenAI({
//   apiKey: env.OPENAI_API_KEY,
//   baseURL: env.GATEWAY_BASE_URL,
// });

// we use ALS to expose the agent context to the tools
// export const agentContext = new AsyncLocalStorage<Chat>();
// /**
//  * Chat Agent implementation that handles real-time AI chat interactions
//  */
// export class Chat extends AIChatAgent<Env> {
//   /**
//    * Handles incoming chat messages and manages the response stream
//    * @param onFinish - Callback function executed when streaming completes
//    */

//   // biome-ignore lint/complexity/noBannedTypes: <explanation>
//   async onChatMessage(onFinish: StreamTextOnFinishCallback<{}>) {
//     const workersai = createWorkersAI({ binding: this.env.AI });
//     // const model = workersai("@cf/meta/llama-3.1-8b-instruct", {});
//     const model = workersai("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {});
//     // Create a streaming response that handles both text and tool outputs
//     return agentContext.run(this, async () => {
//       const dataStreamResponse = createDataStreamResponse({
//         execute: async (dataStream) => {
//           // Process any pending tool calls from previous messages
//           // This handles human-in-the-loop confirmations for tools
//           const processedMessages = await processToolCalls({
//             messages: this.messages,
//             dataStream,
//             tools,
//             executions,
//           });

//           // Stream the AI response using GPT-4
//           const result = streamText({
//             model,
//             system: `You are a helpful assistant that can do various tasks...

// ${unstable_getSchedulePrompt({ date: new Date() })}

// If the user asks to schedule a task, use the schedule tool to schedule the task.
// `,
//             messages: processedMessages,
//             tools,
//             onFinish,
//             onError: (error) => {
//               console.error("Error while streaming:", error);
//             },
//             maxSteps: 10,
//           });

//           // Merge the AI response stream with tool execution outputs
//           result.mergeIntoDataStream(dataStream);
//         },
//       });

//       return dataStreamResponse;
//     });
//   }
//   async executeTask(description: string, task: Schedule<string>) {
//     await this.saveMessages([
//       ...this.messages,
//       {
//         id: generateId(),
//         role: "user",
//         content: `Running scheduled task: ${description}`,
//         createdAt: new Date(),
//       },
//     ]);
//   }
// }

/**
 * Worker entry point that routes incoming requests to the appropriate handler
 */
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (url.pathname === "/check-open-ai-key") {
      const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
      return Response.json({
        success: hasOpenAIKey,
      });
    }
    if (url.pathname === "/sse") {
      return mcpServerHandler(request, env, ctx);
    }
    // if (!process.env.OPENAI_API_KEY) {
    //   console.error(
    //     "OPENAI_API_KEY is not set, don't forget to set it locally in .dev.vars, and use `wrangler secret bulk .dev.vars` to upload it to production",
    //   );
    // }
    return (
      // Route the request to our agent or return 404 if not found
      (await routeAgentRequest(request, env)) ||
      new Response("Not found", { status: 404 })
    );
  },
} satisfies ExportedHandler<Env>;
