import { newGraphSseResponse } from "mtxuilib/agentutils/graph_utils";
import { cookies } from "next/headers";
export const runtime = "edge";

const handler = async (r: Request) => {
  try {
    const accessToken =
      (await cookies()).get("access_token")?.value ||
      r.headers.get("Authorization");
    if (!accessToken) {
      throw new Error("accessToken is required");
    }
    return newGraphSseResponse("storm", await r.json(), {
      configurable: {
        ctx: {
          accessToken: accessToken,
        },
        backendUrl: process.env.MTMAI_BACKEND,
      },
    });
  } catch (e) {
    console.log("run langgraph error", e);
    return new Response(JSON.stringify(e));
  }
};

export const GET = handler;
export const POST = handler;
