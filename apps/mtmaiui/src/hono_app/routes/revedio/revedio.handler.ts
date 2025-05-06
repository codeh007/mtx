import { createRouter } from "../../lib/createApp";

export const revedioRouter = createRouter();

revedioRouter.get("/render", async (c) => {
  return c.json({
    hello: "revedio",
  });
});
