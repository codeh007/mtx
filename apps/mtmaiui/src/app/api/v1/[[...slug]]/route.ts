import { initGomtmApp } from "mtmaiapi/gomtmapp";

export const runtime = "edge";

/**
 * 业务api 反向代理
 */
const handler = async (r: Request) => {
  await initGomtmApp({ r: r });
  const url = new URL(r.url);
  const targetUrl = `http://localhost:8383${url.pathname}${url.search}`;
  const requestHeaders = new Headers(r.headers);
  const response = await fetch(targetUrl, {
    method: r.method,
    headers: requestHeaders,
    body: ["GET", "HEAD"].includes(r.method) ? undefined : r.body,
  });
  console.log(`🚀 [api proxy] ${r.method}(${response.status}) ${targetUrl}`);
  return response;
};

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
export const OPTIONS = handler;
export const HEAD = handler;
