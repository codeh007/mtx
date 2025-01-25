import { cookies } from "next/headers";

import { endpointList } from "mtmaiapi";
import { headers } from "next/headers";
import { edgeApp } from "../../../../lib/edgeapp";

export const runtime = "edge";

/**
 * 业务api 反向代理
 */
const handler = async (r: Request) => {
  let errorMsg = "";

  //加载基本配置
  try {
    await edgeApp.init({
      headers: headers,
      cookies: cookies,
    });
  } catch (e) {
    errorMsg = `加载基本配置失败:${(e as Error).message}`;
  }

  //加载 endpoints 数据
  try {
    const endpointList = await edgeApp.getEndpointList();
    console.log("endpointList:", endpointList);
  } catch (e) {
    errorMsg = `加载 endpoints 数据失败:${(e as Error).message}`;
  }

  console.log(endpointList);
  //开发阶段使用第一条配置作为远程服务器的配置
  const targetEndpoint = endpointList[0];
  const remoteUrl = targetEndpoint.url;
  const token = targetEndpoint.token;

  try {
    // Get original request URL and extract path + search params
    const url = new URL(r.url);
    const targetUrl = `${remoteUrl}${url.pathname}${url.search}`;

    // Forward original headers but override Authorization
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
