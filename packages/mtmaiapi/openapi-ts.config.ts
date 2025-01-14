import {
  type UserConfig,
  defaultPlugins,
  defineConfig,
} from "@hey-api/openapi-ts";
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
  input: "../../../gomtm/api-contracts/openapi/openapi.yaml",
  output: {
    format: "prettier",
    lint: "eslint",
    path: "./src/gomtmapi",
  },
  experimentalParser: true,
  plugins: [
    ...defaultPlugins,
    // '@hey-api/schemas',
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
