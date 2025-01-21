import { newGraphSseResponse } from "mtxuilib/agentutils/graph_utils";
import { cookies } from "next/headers";
export const runtime = "edge";

const handler = async (r: Request) => {
  try {
    let accessToken = (await cookies()).get("access_token")?.value;
    if (!accessToken) {
      const tokenFromHeader = r.headers.get("Authorization");
      if (tokenFromHeader) {
        accessToken = tokenFromHeader.split(" ")[1];
      }
    }
    if (!accessToken) {
      throw new Error("accessToken is required");
    }
    return newGraphSseResponse("opencanvas", await r.json(), {
      configurable: {
        gomtmApiUrl: process.env.MTMAI_BACKEND,
        // accessToken: accessToken,
      },
      ctx: {
        accessToken: accessToken,
      },
      backendUrl: process.env.MTMAI_BACKEND,
    });
  } catch (e) {
    console.log("run langgraph error", e);
    return new Response(JSON.stringify(e));
  }
};

export const GET = handler;
export const POST = handler;
