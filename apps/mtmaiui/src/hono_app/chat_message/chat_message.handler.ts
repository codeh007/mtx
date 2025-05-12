import { eq } from "drizzle-orm";
import { getDb } from "../../db/dbClientV2";
import { chatMessage } from "../../db/schema";
import { createRouter } from "../agent_api/lib/createApp";

export const chatMessageRouter = createRouter();

chatMessageRouter.get("/", async (c) => {
  const chatId = c.req.query("chatId");

  if (!chatId) {
    return c.json(
      {
        error: "chatId is required",
      },
      400,
    );
  }

  const chatMessages = await getDb()
    .select()
    .from(chatMessage)
    .where(eq(chatMessage.chatId, chatId));
  return c.json({
    rows: chatMessages,
  });
});
