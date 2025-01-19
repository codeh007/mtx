import { newGraphSseResponse } from "mtxuilib/agentutils/graph_utils";
import type { GraphInput } from "../../../stores/GraphContext";
export const runtime = "edge";

const exampleUserInput = "What's the weather like today?";

const handler = async (r: Request) => {
  try {
    const input = {
      messages: [{ role: "user", content: exampleUserInput }],
    };

    //TODO: 增加 zod schema 验证输入格式
    const graphInput = (await r.json()) as GraphInput;
    console.log("graphInput", graphInput);

    // const builder = createAssistantGraph();
    // // const runnable = builder.getRunnable();
    // // const a = runnable.invoke(input);

    // const graph = builder.compile();
    // const result = await graph.invoke(input);
    // return new Response(JSON.stringify(result));
    return newGraphSseResponse("test", graphInput, {});
  } catch (e) {
    console.log("run langgraph error", e);
    return new Response(JSON.stringify(e));
  }
};

export const GET = handler;
export const POST = handler;
