import { cors } from "hono/cors";
import configureOpenAPI from "./lib/configureOpenAPI";

import type { Provider } from "@auth/core/providers";
import { authHandler, initAuthConfig, verifyAuth } from "@hono/auth-js";
import { providers } from "../lib/auth/auth_providers";
// import configureAgents from "./lib/configureAgents";
// import configureAuth from "./lib/configureAuth";
import createApp from "./lib/createApp";
// import configureAgentDemo from "./routes/agent_api/agent_handler";
import { apiRoutes } from "./routes/api_routes";
// import { authRouter } from "./routes/auth/auth.handler";
import helloDbRouter from "./routes/db-example/dbexample.handler";
import { envsRouter } from "./routes/envs/envs.handler";
import { r2Router } from "./routes/r2/r2.handler";
import { scriptRouter } from "./routes/scripts/scripts.handler";
import { sessionRouter } from "./routes/session/session.handler";
import gomtmProxyRouter from "./routes/v1/v1_route";
import { workflowsRoute } from "./routes/workflows/workflows.handler";
const app = createApp().basePath("/api");

app.use("*", cors());
app.use(
  "/users",
  cors({
    origin: "http://localhost:5173",
  }),
);

configureOpenAPI(app as any);

app.use(
  "*",
  initAuthConfig((c) => ({
    secret: c.env.AUTH_SECRET,
    providers: providers as Provider[],
  })),
);

app.use("/auth/*", authHandler());
app.use("/*", verifyAuth());
// configureAuth(app);
// configureAgents(app);
// configureAgentDemo(app);
// app.route("/auth/", authRouter);
app.route("/r2/", r2Router);
app.route("/scripts/", scriptRouter);
app.route("/envs/", envsRouter);
app.route("/workflows/", workflowsRoute);
app.route("/session/", sessionRouter);
for (const route of apiRoutes) {
  app.route("/", route);
}
app.route("/v1/*", gomtmProxyRouter);
app.route("/", helloDbRouter);
export default app;
