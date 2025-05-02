import { cors } from "hono/cors";
import configureOpenAPI from "./lib/configureOpenAPI";

import configureAuth from "./lib/configureAuth";
import createApp from "./lib/createApp";
import { apiRoutes } from "./routes/api_routes";
import helloDbRouter from "./routes/db-example/dbexample.handler";
import r2Router from "./routes/r2/r2.handler";
import gomtmProxyRouter from "./routes/v1/v1_route";
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
// configureAgents(app);
// configureAgentDemo(app);
// app.route("/browser/", browserRouter);
for (const route of apiRoutes) {
  app.route("/", route);
}

app.route("/", r2Router);
app.route("/", helloDbRouter);
app.route("/v1/*", gomtmProxyRouter);
// mcp 服务
// app.route("/", mcpSseRoute);

export default app;
