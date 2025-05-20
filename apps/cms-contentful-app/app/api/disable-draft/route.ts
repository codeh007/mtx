import { draftMode } from "next/headers";

export async function GET(request: Request) {
  const { disable } = await draftMode();
  disable();
  return new Response("Draft mode is disabled");
}
