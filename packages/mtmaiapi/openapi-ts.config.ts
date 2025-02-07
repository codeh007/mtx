import { type UserConfig, defineConfig } from "@hey-api/openapi-ts";

//新版，使用golang openapi 后端
export default defineConfig({
  input: "../../../gomtm/api-contracts/openapi/openapi.yaml",
  output: {
    format: "prettier",
    lint: "eslint",
    path: "./src/gomtmapi",
  },
  experimentalParser: true,
  plugins: [
    // ...defaultPlugins,
    "@hey-api/typescript",
    "@hey-api/client-fetch",
    "@hey-api/schemas",
    {
      enums: "javascript",
      name: "@hey-api/typescript",
    },
    "@tanstack/react-query",
    "zod",
    // "@hey-api/sdk",
    {
      name: "@hey-api/sdk",
      validator: true,
    },
  ],
}) as UserConfig;
