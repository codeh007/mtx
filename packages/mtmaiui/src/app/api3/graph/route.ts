import { createAssistantGraph } from "mtxuilib/agents/assisant";

export const runtime = "edge";

const exampleUserInput = "What's the weather like today?";

const handler = async (r: Request) => {
  try {
    const input = {
      messages: [{ role: "user", content: exampleUserInput }],
    };
    const builder = createAssistantGraph();
    // const runnable = builder.getRunnable();
    // const a = runnable.invoke(input);

    const graph = builder.compile();
    const result = await graph.invoke(input);
    return new Response(JSON.stringify(result));
  } catch (e) {
    return new Response(JSON.stringify(e));
  }
};

export const GET = handler;
export const POST = handler;
