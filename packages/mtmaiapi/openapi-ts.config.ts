import {
  type UserConfig,
  defaultPlugins,
  defineConfig,
} from "@hey-api/openapi-ts";

//新版，使用golang openapi 后端
export default defineConfig({
  // client: "@hey-api/client-fetch",

  input: "../../../gomtm/api-contracts/openapi/openapi.yaml",
  output: {
    format: "prettier",
    lint: "eslint",
    path: "./src/gomtmapi",
  },
  // enums: "typescript",
  experimentalParser: true,
  plugins: [
    ...defaultPlugins,
    "@hey-api/client-fetch",
    // '@hey-api/schemas',
    {
      enums: "javascript",
      name: "@hey-api/typescript",
    },
    "@tanstack/react-query",
    // "zod",
    // {
    //   name: "@hey-api/sdk",
    //   validator: true,
    // },
  ],
  // types: {
  //   enums: "javascript",
  //   // name: "@hey-api/typescript",
  // },
}) as UserConfig;
