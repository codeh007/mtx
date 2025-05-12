import { cors } from "hono/cors";
import configureOpenAPI from "./lib/configureOpenAPI";

import configureAgents from "./lib/configureAgents";
import configureAuth from "./lib/configureAuth";
import createApp from "./lib/createApp";
import configureAgentDemo from "./routes/agent_api/agent_handler";
import { apiRoutes } from "./routes/api_routes";
import helloDbRouter from "./routes/db-example/dbexample.handler";
import { envsRouter } from "./routes/envs/envs.handler";
import { r2Router } from "./routes/r2/r2.handler";
// import { revedioRouter } from "./routes/revedio/revedio.handler";
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

configureAuth(app);
configureAgents(app);
configureAgentDemo(app);
app.route("/r2/", r2Router);
app.route("/scripts/", scriptRouter);
app.route("/envs/", envsRouter);
app.route("/workflows/", workflowsRoute);
// app.route("/revedio/", revedioRouter);
app.route("/session/", sessionRouter);
for (const route of apiRoutes) {
  app.route("/", route);
}
app.route("/v1/*", gomtmProxyRouter);
app.route("/", helloDbRouter);
export default app;
