import { createRouter } from "../../lib/createApp";

const browserRouter = createRouter();

browserRouter.get("/hellobrowser", async (c) => {
  // Add db query to get all users
  const env = c.env;

  return c.json({
    message: "Hello browser",
  });
});

export default browserRouter;
