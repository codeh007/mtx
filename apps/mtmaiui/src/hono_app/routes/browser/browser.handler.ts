import { createRouter } from "../../lib/createApp";

const browserRouter = createRouter();

browserRouter.all("/hellobrowser", async (c) => {
  return c.json({
    message: "Hello browser",
  });
});

export default browserRouter;
