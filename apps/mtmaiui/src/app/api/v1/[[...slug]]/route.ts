import { cookies } from "next/headers";

import { endpointList } from "mtmaiapi";
import { edgeApp } from "mtxuilib/lib/edgeapp";
import { headers } from "next/headers";

export const runtime = "edge";

/**
 * 业务api 反向代理
 */
const handler = async (r: Request) => {
  let errorMsg = "";
  try {
    await edgeApp.init({
      headers: headers,
      cookies: cookies,
    });
  } catch (e) {
    errorMsg = `edgeApp.init error:${(e as Error).message}`;
  }

  try {
    const endpointList = await edgeApp.getEndpointList();

    console.log("endpointList:", endpointList);
  } catch (e) {
    errorMsg = `load endpointList error:${(e as Error).message}`;
  }

  //开发阶段使用第一条配置作为远程服务器的配置
  const targetEndpoint = endpointList[0];
  const remoteUrl = targetEndpoint.url;
  const token = targetEndpoint.token;

  try {
    const url = new URL(r.url);
    const targetUrl = `${remoteUrl}${url.pathname}${url.search}`;
    const requestHeaders = new Headers(r.headers);
    requestHeaders.set("Authorization", `Bearer ${token}`);

    console.log(
      `🚀 [endpoint api proxy] ${r.method} ${targetUrl} len:${r.body?.length}`,
    );
    // Forward the request with same method, headers and body
    const response = await fetch(targetUrl, {
      method: r.method,
      headers: requestHeaders,
      body: ["GET", "HEAD"].includes(r.method) ? undefined : r.body,
    });
    return response;
  } catch (e) {
    errorMsg = `请求远程服务器失败:${(e as Error).message}`;
  }

  if (errorMsg) {
    return new Response(errorMsg, { status: 500 });
  }
  return new Response("unknown error");
};

export const GET = handler;
export const POST = handler;
