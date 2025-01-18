export const runtime = "nodejs";

const handler = async (req: Request) => {
  //   const { messages } = await req.json();
  //   const response = await chatbot.invoke(messages);
  //   return NextResponse.json(response);
  return new Response("Hello chat api");
};

// export { GET, POST } from "next-auth/react";
export const GET = handler;
export const POST = handler;
