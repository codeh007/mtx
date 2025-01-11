export * from "./gomtmapi";
export * from "./gomtmapi/@tanstack/react-query.gen";
// export * from "./api/generated/"
// import { cookies } from "next/headers";

import { client } from "./gomtmapi";

export const cookieAccessToken = "mtmaibot_access_token"; //mtmaibot_access_token

export function initMtiaiClient() {
  const mtmaiBackend = process.env.MTMAI_BACKEND;
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

// import { HatchetClient as Hatchet } from '@clients/hatchet-client';

// export * from './workflow';
// export * from './step';
// export * from './clients/worker';
// export * from './clients/rest';
// export * from './clients/admin';
// export * from './util/workflow-run-ref';

// export default Hatchet;
