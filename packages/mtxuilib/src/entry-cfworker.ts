// export { WfHelloAssisant } from "mtxuilib/workflows/hello-assisant.ts";
// export { WfHelloToolUse } from "mtxuilib/workflows/hello-tooluse.ts";
export { MyWorkflow } from "./workflows/hello-workflow";
// export { WorkflowDemo } from "./workflows/WorkflowDemo";
// import { handleWsRequest } from "mtxuilib/routes/ws/wsApp";

import type { EndpointList, Env } from "mtmaiapi/gomtmapi/types.gen";
import { getEndpointList, initEdgeApp } from "./lib/sslib";
import { handleWsRequest } from "./routes/ws/wsApp";
export default {
  async fetch(request: Request, env, ctx) {
    //设置环境变量,达到兼容 nodejs 的目的
    for (const key in env) {
      if (typeof env[key] === "string") {
        // console.log(`set env:${key}=${env[key]}`);
        process.env[key] = env[key];
      }
    }
    try {
      const uri = new URL(request.url);
      if (uri.pathname.startsWith("/api/ws")) {
        return handleWsRequest(request, env, ctx);
      }
      // return mainApp.fetch(request, env, ctx);
      const response = await proxyHandler(request, env, ctx);

      // 添加禁用缓存的响应头
      const headers = new Headers(response.headers);
      headers.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate",
      );
      headers.set("Pragma", "no-cache");
      headers.set("Expires", "0");

      return response;
    } catch (e) {
      const error = e as Error;
      const errorDetails = {
        message: error.message,
        stack: error.stack,
        name: error.name,
        cause: error.cause,
      };
      const response = new Response(
        JSON.stringify(
          {
            error: "Internal Server Error2",
            details: errorDetails,
          },
          null,
          2,
        ),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      // 添加禁用缓存的响应头
      const headers = new Headers(response.headers);
      headers.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate",
      );
      headers.set("Pragma", "no-cache");
      headers.set("Expires", "0");
      return response;
    }
  },
};

/**
 * 业务api 反向代理
 */
const proxyHandler = async (r: Request, env?: Env, ctx?: ExecutionContext) => {
  console.log(`env:${JSON.stringify(env)}`);
  await initEdgeApp({});

  let endpointList: EndpointList | undefined = undefined;
  endpointList = await getEndpointList();

  if (!endpointList?.rows?.length) {
    throw new Error("endpointList is empty");
  }
  //开发阶段使用第一条配置作为远程服务器的配置
  const targetEndpoint = endpointList[0];
  const remoteUrl = targetEndpoint.url;
  const token = targetEndpoint.token;

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
};
