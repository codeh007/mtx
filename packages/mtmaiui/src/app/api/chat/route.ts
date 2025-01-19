import { newGraphSseResponse } from "mtxuilib/agentutils/graph_utils";
export const runtime = "edge";

// const exampleUserInput = "What's the weather like today?";

const handler = async (r: Request) => {
  try {
    // const input = {
    //   messages: [{ role: "user", content: exampleUserInput }],
    // };

    //TODO: 增加 zod schema 验证输入格式
    // const graphInput =  as GraphInput;
    // console.log("graphInput", graphInput);
    return newGraphSseResponse("test", await r.json(), {});
  } catch (e) {
    console.log("run langgraph error", e);
    return new Response(JSON.stringify(e));
  }
};

export const GET = handler;
export const POST = handler;
