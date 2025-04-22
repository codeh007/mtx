import { cors } from "hono/cors";
import configureOpenAPI from "./lib/configureOpenAPI";

import configureAuth from "./lib/configureAuth";
import createApp from "./lib/createApp";
import { apiRoutes } from "./routes/api_routes";
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

for (const route of apiRoutes) {
  app.route("/", route);
}

// mcp 服务
// app.route("/", mcpSseRoute);

export default app;
