import { getBackendUrl, initGomtmApp } from "mtmaiapi/gomtmapp";
import { copyIncomeHeaders } from "mtxuilib/http/rproxy";

export const runtime = "edge";

/**
 * 业务api 反向代理
 */
const handler = async (r: Request) => {
  await initGomtmApp({ r: r });
  const url = new URL(r.url);
  const backendUrl = getBackendUrl();
  const targetUrl = `${backendUrl}${url.pathname}${url.search}`;
  const requestHeaders = copyIncomeHeaders(r);
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
