import { createRouter } from "../agent_api/lib/createApp";

export const chatV2Router = createRouter();

chatV2Router.all("/sse", async (c) => {
  try {
    return c.json("hello");
  } catch (e: any) {
    return c.json({ error: e.message, stack: e.stack }, 500);
  }
});
