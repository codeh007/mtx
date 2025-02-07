import {
  type UserConfig,
  defaultPlugins,
  defineConfig,
} from "@hey-api/openapi-ts";

//新版，使用golang openapi 后端
export default defineConfig({
  input: "../../../gomtm/api-contracts/openapi/openapi.yaml",
  // client: "@hey-api/client-fetch",
  output: {
    format: "prettier",
    lint: "eslint",
    path: "./src/gomtmapi",
  },
  experimentalParser: true,
  plugins: [
    ...defaultPlugins,
    "@hey-api/client-fetch",
    "@hey-api/schemas",
    {
      enums: "javascript",
      name: "@hey-api/typescript",
    },
    "@tanstack/react-query",
    "zod",
    // {
    //   name: "@hey-api/sdk",
    //   validator: true,
    // },
  ],
}) as UserConfig;
