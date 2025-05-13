import { cors } from "hono/cors";
import configureOpenAPI from "./agent_api/lib/configureOpenAPI";

import type { Provider } from "@auth/core/providers";
import { authHandler, initAuthConfig } from "@hono/auth-js";
import { providers } from "../lib/auth/auth_providers";
import { eventRouter } from "./adk/event.handler";
import { sessionRouter } from "./adk/session.handler";
import { agentsMiddleware } from "./agent_api/lib/agentsMiddleware";
// import configureAgents from "./agent_api/lib/configureAgents";
import createApp from "./agent_api/lib/createApp";
import { chatRouter } from "./chat/chat.handler";
import { chatMessageRouter } from "./chat_message/chat_message.handler";
import { chatV2Router } from "./chat_v2/chat_v2_handler";
import { envsRouter } from "./envs/envs.handler";
import { mqRouter } from "./mq/mq.handler";
import { r2Router } from "./r2/r2.handler";
import { scriptRouter } from "./scripts/scripts.handler";
import gomtmProxyRouter from "./v1/v1_route";
import { workflowsRoute } from "./workflows/workflows.handler";
const app = createApp().basePath("/api");

app.use("*", async (c, next) => {
  // c.set("X-Powered-By", "Hono");
  globalThis.Hyperdrive = c.env.HYPERDRIVE;
  await next();
});
app.use("*", cors());
app.use(
  "/users",
  cors({
    origin: "http://localhost:5173",
  }),
);

configureOpenAPI(app as any);

// 设置 cloudflare agents 中间件
app.use(
  "/*",
  agentsMiddleware({
    onError: (error) => {
      console.log("aggents onError", error);
      return new Response(`error:${error}`, { status: 401 });
    },
    options: {
      // 设置前缀:
      prefix: "agents", // Handles /agents/* routes only
      cors: true,
      // 在连接之前验证请求
      onBeforeConnect: async (req) => {
        const token = req.headers.get("authorization");
        // validate token
        // if (!token) return new Response("(agents)Unauthorized", { status: 401 });
      },
    },
  }),
);

// auth 组件: https://github.com/honojs/middleware
app.use(
  "*",
  initAuthConfig((c) => ({
    secret: c.env.AUTH_SECRET,
    providers: providers as Provider[],
  })),
);
// 认证 及 session api , 基于 hono auth js
app.use("/auth/*", authHandler());
// 暂时关闭认证
// app.use("/*", verifyAuth());

// configureAuth(app);
// configureAgents(app);
// configureAgentDemo(app);

app.route("/r2/", r2Router);
app.route("/scripts/", scriptRouter);
app.route("/envs/", envsRouter);
app.route("/workflows/", workflowsRoute);
app.route("/adk/session/", sessionRouter);
app.route("/adk/events/", eventRouter);
app.route("/chat_v2/", chatV2Router);
app.route("/chat/", chatRouter);
app.route("/chat_message/", chatMessageRouter);
app.route("/v1/*", gomtmProxyRouter);
app.route("/mq", mqRouter);
export default app;
