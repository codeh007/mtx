export * from "./gomtmapi";
export * from "./gomtmapi/@tanstack/react-query.gen";

import { client } from "./gomtmapi";

export const cookieAccessToken = "mtm_access_token";

export function initMtiaiClient(backendUrl: string) {
  console.log("initMtiaiClient", backendUrl);
  client?.setConfig({
    baseUrl: backendUrl,
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
