import { cors } from "hono/cors";
import configureOpenAPI from "./agent_api/lib/configureOpenAPI";

import type { Provider } from "@auth/core/providers";
import { authHandler, initAuthConfig } from "@hono/auth-js";
import { providers } from "../lib/auth/auth_providers";
import { eventRouter } from "./adk/event.handler";
import { sessionRouter } from "./adk/session.handler";
import createApp from "./agent_api/lib/createApp";
import { chatRouter } from "./chat/chat.handler";
import { chatV2Router } from "./chat_v2/chat_v2_handler";
import { envsRouter } from "./envs/envs.handler";
import { r2Router } from "./r2/r2.handler";
import { scriptRouter } from "./scripts/scripts.handler";
import gomtmProxyRouter from "./v1/v1_route";
import { workflowsRoute } from "./workflows/workflows.handler";
const app = createApp().basePath("/api");

app.use("*", cors());
app.use(
  "/users",
  cors({
    origin: "http://localhost:5173",
  }),
);

configureOpenAPI(app as any);

// auth 组件: https://github.com/honojs/middleware
app.use(
  "*",
  initAuthConfig((c) => ({
    secret: c.env.AUTH_SECRET,
    providers: providers as Provider[],
  })),
);
// 认真 及 session api , 基于 hono auth js
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
app.route("/v1/*", gomtmProxyRouter);
export default app;
