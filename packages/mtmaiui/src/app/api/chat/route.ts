import { cookieAccessToken } from "mtmaiapi";
import { newGraphSseResponse } from "mtxuilib/agentutils/graph_utils";
import { cookies } from "next/headers";
export const runtime = "edge";

const handler = async (r: Request) => {
  try {
    const accessToken = (await cookies()).get(cookieAccessToken)?.value;
    return newGraphSseResponse("opencanvas", await r.json(), {
      configurable: {
        gomtmApiUrl: process.env.MTMAI_BACKEND,
        accessToken: accessToken,
      },
    });
  } catch (e) {
    console.log("run langgraph error", e);
    return new Response(JSON.stringify(e));
  }
};

export const GET = handler;
export const POST = handler;
