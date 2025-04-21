import { cors } from "hono/cors";
import configureOpenAPI from "./lib/configureOpenAPI";
import mcpSseRoute from "./routes/mcp/mcp_handler";

import configureAgents from "./lib/configureAgents";
import configureAuth from "./lib/configureAuth";
import createApp from "./lib/createApp";
import configureAgentDemo from "./routes/agent_demo/agent_demo_handler";
import { apiRoutes } from "./routes/api_routes";
const app = createApp();

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

// const routes = [users, plateformAccount] as const;

for (const route of apiRoutes) {
  app.route("/", route);
}

// mcp 服务
app.route("/", mcpSseRoute);

export default app;
