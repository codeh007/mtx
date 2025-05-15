import { eq } from "drizzle-orm";
import { getDbV3 } from "../../db/dbClientV3";
import { chat } from "../../db/schema";
import { createRouter } from "../agent_api/lib/createApp";

export const chatV3Router = createRouter();

chatV3Router.get("/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const [selectedChat] = await getDbV3().select().from(chat).where(eq(chat.id, id));
    return c.json(selectedChat);
  } catch (e: any) {
    return c.json({ error: e.message, stack: e.stack }, 500);
  }
});
