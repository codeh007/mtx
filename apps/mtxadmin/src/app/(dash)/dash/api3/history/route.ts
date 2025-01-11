import { getChatsByUserId } from "mtmaiui/db/queries";
import { auth } from "../../../../(auth)/auth";

export async function GET() {
  const session = await auth();

  if (!session || !session.user) {
    return Response.json("Unauthorized!", { status: 401 });
  }

  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  const chats = await getChatsByUserId({ id: session.user.id! });
  return Response.json(chats);
}
