import { createAssistantGraph } from "mtxuilib/agents/assisant";
// import { graphSseStream } from "mtxuilib/graphs/graphutils/graphutils.ts";

export const runtime = "edge";
const handler = async (r: Request) => {
  const input = {
    messages: [{ role: "user", content: "What's the weather like today?" }],
  };
  // const a = graphSseStream("assisant", input, {});
  // const response = newStreamResponse(a);
  // return response;
  const builder = createAssistantGraph();
  // const runnable = builder.getRunnable();
  // const a = runnable.invoke(input);
  return new Response(JSON.stringify(builder.nodes));
};

export const GET = handler;
export const POST = handler;
