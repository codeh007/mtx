// import { newGraphSseResponse } from "mtxuilib/agentutils/graph_utils";
// import { cookies } from "next/headers";
// import type { ChatCompletionCreateParams, ChatCompletionMessageParam } from "openai/resources/chat/completions";

export const runtime = "edge";

export const maxDuration = 30;
const handler = async (r: Request) => {
  const { messages } = (await r.json()) as any;

  // 基于ai-sdk 的实现
  // const result = streamText({
  //   model: openai("gpt-4o"),
  //   messages,
  // });

  // return result.toDataStreamResponse();

  // 备忘代码,调用 langgraph
  // try {
  //   const accessToken =
  //     (await cookies()).get("access_token")?.value ||
  //     r.headers.get("Authorization");
  //   if (!accessToken) {
  //     throw new Error("accessToken is required");
  //   }
  //   return newGraphSseResponse("storm", await r.json(), {
  //     configurable: {
  //       ctx: {
  //         accessToken: accessToken,
  //       },
  //       backendUrl: process.env.MTMAI_BACKEND,
  //     },
  //   });
  // } catch (e) {
  //   console.log("run langgraph error", e);
  //   return new Response(JSON.stringify(e));
  // }
};

export const GET = handler;
export const POST = handler;
