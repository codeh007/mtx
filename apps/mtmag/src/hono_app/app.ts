import GitHub from "@auth/core/providers/github";
import { authHandler, initAuthConfig, verifyAuth } from "@hono/auth-js";
// import { Hono } from "hono";
import { agentsMiddleware } from "hono-agents";
import { cors } from "hono/cors";
import configureOpenAPI from "./lib/configureOpenAPI";
import mcpSseRoute from "./mcp_handler";
import users from "./routes/users/users.index";

import createApp from "./lib/createApp";
import {
  homeContent,
  layout,
  parseApproveFormBody,
  renderAuthorizationApprovedContent,
  renderAuthorizationRejectedContent,
  renderLoggedInAuthorizeScreen,
  renderLoggedOutAuthorizeScreen,
} from "./utils";

// export type Bindings = Env & {
//   OAUTH_PROVIDER: OAuthHelpers;
// };

// const app = new Hono<{
//   Bindings: Bindings;
// }>();
const app = createApp();
const routes = [users] as const;

app.use(
  "/users",
  cors({
    origin: "http://localhost:5173",
  }),
);

configureOpenAPI(app as any);
// biome-ignore lint/complexity/noForEach: <explanation>
routes.forEach((route) => {
  app.route("/", route);
});
app.use("*", cors());
// 设置 cloudflare agents 中间件
app.use(
  "*",
  agentsMiddleware({
    onError: (error) => console.error(error),
    options: {
      // 设置前缀:
      prefix: "agents", // Handles /agents/* routes only
      // 在连接之前验证请求
      // onBeforeConnect: async (req) => {
      //         const token = req.headers.get("authorization");
      //         // validate token
      //         if (!token) return new Response("Unauthorized", { status: 401 });
      //       },
    },
  }),
);

// authjs 配置开始 =============================================================
// 文档: https://github.com/honojs/middleware/tree/main/packages/auth-js
app.use(
  "*",
  initAuthConfig((c) => ({
    /**
     * authjs 问题排查:
     *    1: 必须设置 AUTH_SECRET 及 AUTH_URL 变量
     */
    secret: c.env.AUTH_SECRET,
    providers: [
      GitHub({
        clientId: c.env.GITHUB_CLIENT_ID,
        clientSecret: c.env.GITHUB_CLIENT_SECRET,
      }),
    ],
  })),
);

app.use("/api/auth/*", authHandler());
app.use("/api/*", verifyAuth());
app.get("/api/protected", (c) => {
  const auth = c.get("authUser");
  return c.json(auth);
});
// authjs 配置结束 =============================================================

// agent 调用(演示开始) =============================================================
app.post("/query", async (c) => {
  const { agentId, prompt } = await c.req.json<{
    agentId: string;
    prompt: string;
  }>();
  const id = c.env.RootAg.idFromName(agentId);
  const agent = c.env.RootAg.get(id);

  // const result = await agent.query(prompt);
  return c.json({ hello: "world" });
});

app.post("/confirmations/:confirmationId", async (c) => {
  const { agentId, confirm } = await c.req.json<{
    agentId: string;
    confirm: boolean;
  }>();
  const confirmationId = c.req.param("confirmationId");
  const id = c.env.RootAg.idFromName(agentId);
  const agent = c.env.RootAg.get(id);

  // const result = await agent.confirm(confirmationId, confirm);
  return c.json({ hello: "world" });
});

// agent 调用(演示结束) =============================================================

// Render a basic homepage placeholder to make sure the app is up
app.get("/", async (c) => {
  const content = await homeContent(c.req.raw);
  return c.html(layout(content, "MCP Remote Auth Demo - Home"));
});

// Render an authorization page
// If the user is logged in, we'll show a form to approve the appropriate scopes
// If the user is not logged in, we'll show a form to both login and approve the scopes
app.get("/authorize", async (c) => {
  // We don't have an actual auth system, so to demonstrate both paths, you can
  // hard-code whether the user is logged in or not. We'll default to true
  // const isLoggedIn = false;
  const isLoggedIn = true;

  const oauthReqInfo = await c.env.OAUTH_PROVIDER.parseAuthRequest(c.req.raw);

  const oauthScopes = [
    {
      name: "read_profile",
      description: "Read your basic profile information",
    },
    { name: "read_data", description: "Access your stored data" },
    { name: "write_data", description: "Create and modify your data" },
  ];

  if (isLoggedIn) {
    const content = await renderLoggedInAuthorizeScreen(oauthScopes, oauthReqInfo);
    return c.html(layout(content, "MCP Remote Auth Demo - Authorization"));
  }

  const content = await renderLoggedOutAuthorizeScreen(oauthScopes, oauthReqInfo);
  return c.html(layout(content, "MCP Remote Auth Demo - Authorization"));
});

// The /authorize page has a form that will POST to /approve
// This endpoint is responsible for validating any login information and
// then completing the authorization request with the OAUTH_PROVIDER
app.post("/approve", async (c) => {
  const { action, oauthReqInfo, email, password } = await parseApproveFormBody(
    await c.req.parseBody(),
  );

  if (!oauthReqInfo) {
    return c.html("INVALID LOGIN", 401);
  }

  // If the user needs to both login and approve, we should validate the login first
  if (action === "login_approve") {
    // We'll allow any values for email and password for this demo
    // but you could validate them here
    // Ex:
    // if (email !== "user@example.com" || password !== "password") {
    // biome-ignore lint/correctness/noConstantCondition: This is a demo
    if (false) {
      return c.html(
        layout(
          await renderAuthorizationRejectedContent("/"),
          "MCP Remote Auth Demo - Authorization Status",
        ),
      );
    }
  }

  // The user must be successfully logged in and have approved the scopes, so we
  // can complete the authorization request
  const { redirectTo } = await c.env.OAUTH_PROVIDER.completeAuthorization({
    request: oauthReqInfo,
    userId: email,
    metadata: {
      label: "Test User",
    },
    scope: oauthReqInfo.scope,
    props: {
      userEmail: email,
    },
  });

  return c.html(
    layout(
      await renderAuthorizationApprovedContent(redirectTo),
      "MCP Remote Auth Demo - Authorization Status",
    ),
  );
});

// mcp 服务
app.route("/sse", mcpSseRoute);

export default app;
