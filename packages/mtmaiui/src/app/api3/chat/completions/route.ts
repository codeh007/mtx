export const runtime = "edge";

const handler = (req: Request) => {
  const uri = new URL(req.url);

  const search = uri.searchParams.get("search");
  return new Response("Hello World test1");
};

export const POST = handler;
export const GET = handler;
