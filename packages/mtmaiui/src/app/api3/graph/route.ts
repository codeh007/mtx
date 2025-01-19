import { createAssistantGraph } from "mtxuilib/agents/assisant";

export const runtime = "edge";

const exampleUserInput = "What's the weather like today?";

const handler = async (r: Request) => {
  const input = {
    messages: [{ role: "user", content: exampleUserInput }],
  };
  const builder = createAssistantGraph();
  // const runnable = builder.getRunnable();
  // const a = runnable.invoke(input);
  return new Response(JSON.stringify(builder.nodes));
};

export const GET = handler;
export const POST = handler;
