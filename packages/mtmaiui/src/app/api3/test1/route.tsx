export const runtime = "edge";

const handler = (req: Request) => {
  return new Response("Hello World test1");
};

export const POST = handler;
export const GET = handler;
