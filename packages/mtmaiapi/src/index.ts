export * from "./gomtmapi";
export * from "./gomtmapi/@tanstack/react-query.gen";

import { client } from "./gomtmapi";

export const cookieAccessToken = "mtmaibot_access_token"; //mtmaibot_access_token

export function initMtiaiClient(backendUrl?: string) {
  const mtmaiBackend = backendUrl || process.env.MTMAI_BACKEND;
  client?.setConfig({
    baseUrl: mtmaiBackend,
    // fetch:  async (req) => {
    //   const accessToken = (await cookies()).get(cookieAccessToken)?.value;
    //   console.log("mtmai ssr fetch", req)
    //   return fetch(req, {
    //     headers: {
    //       ...req.headers,
    //       "Content-Type": "application/json",
    //       ...(accessToken && {
    //         Authorization: `Bearer ${accessToken}`,
    //       }),
    //     },
    //     //允许跨站cookie，这样可以不用专门设置 Authorization header
    //     credentials: "include",
    //   });
    // },
  });
}
