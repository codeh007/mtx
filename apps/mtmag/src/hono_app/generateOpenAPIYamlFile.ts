import { writeFileSync } from "node:fs";
import * as yaml from "js-yaml";

import configureOpenAPI, { openAPIObjectConfig } from "./lib/configureOpenAPI";
import createApp from "./lib/createApp";
import { apiRoutes } from "./routes/api_routes";

const app = createApp();

// const routes = [users, plateformAccount] as const;

configureOpenAPI(app);
// biome-ignore lint/complexity/noForEach: <explanation>
apiRoutes.forEach((route) => {
  app.route("/", route);
});

// Convert the OpenAPIObject to YAML string
const yamlString = yaml.dump(app.getOpenAPI31Document(openAPIObjectConfig));

// Save the YAML string to a file
writeFileSync("openapi.yaml", yamlString);
