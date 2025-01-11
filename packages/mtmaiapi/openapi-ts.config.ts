import { type UserConfig, defineConfig } from "@hey-api/openapi-ts";

// 旧版: 使用fastapi 后端的openapi
// export default defineConfig({
//   client: "@hey-api/client-fetch",
//   input: "../../pyprojects/mtmai/mtmai/openapi.json",
//   output: {
//     format: "prettier",
//     lint: "eslint",
//     path: "./src",
//   },
//   plugins: ["@tanstack/react-query"],
//   types: {
//     enums: "javascript",
//   },
// }) as UserConfig;

//新版，使用golang openapi 后端
export default defineConfig({
  client: "@hey-api/client-fetch",
  input: "../../api-contracts/openapi/openapi.yaml",
  output: {
    format: "prettier",
    lint: "eslint",
    path: "./src/gomtmapi",
  },
  plugins: [
    // '@hey-api/schemas',
    // '@hey-api/sdk',
    "@tanstack/react-query",
  ],
  types: {
    enums: "javascript",
    // name: "@hey-api/typescript",
  },
}) as UserConfig;
