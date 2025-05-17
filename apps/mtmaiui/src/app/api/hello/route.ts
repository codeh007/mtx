import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const envjson = process.env;
  return Response.json({ envjson });
}
