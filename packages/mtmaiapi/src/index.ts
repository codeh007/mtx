export * from "./gomtmapi";
export * from "./gomtmapi/@tanstack/react-query.gen";
import type { Config } from "@hey-api/client-fetch";
import { client } from "./gomtmapi/client.gen";
export const cookieAccessToken = "mtm_access_token";

export function initMtiaiClient(config: Config) {
  if (!config.baseUrl) {
    throw new Error("initMtiaiClient backendUrl is not set");
  }
  client?.setConfig({
    ...config,
  });
}
