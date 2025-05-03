import { cors } from "hono/cors";
import configureOpenAPI from "./lib/configureOpenAPI";

import configureAuth from "./lib/configureAuth";
import createApp from "./lib/createApp";
// import browserRouter from "./routes/browser/browser.handler";
// import gomtmProxyRouter from "./routes/v1/v1_route";
const localApp = createApp().basePath("/api/browser");

localApp.use("*", cors());

configureOpenAPI(localApp as any);
configureAuth(localApp);
// configureAgents(app);
// configureAgentDemo(app);

// for (const route of apiRoutes) {
//   localApp.route("/", route);
// }
// localApp.route("/", helloDbRouter);
// localApp.route("/", browserRouter);
// localApp.route("/v1/*", gomtmProxyRouter);
// mcp 服务
// app.route("/", mcpSseRoute);

export default localApp;
