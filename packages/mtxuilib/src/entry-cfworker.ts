// export { WfHelloAssisant } from "mtxuilib/workflows/hello-assisant.ts";
// export { WfHelloToolUse } from "mtxuilib/workflows/hello-tooluse.ts";
export { MyWorkflow } from "./workflows/hello-workflow";
// export { WorkflowDemo } from "./workflows/WorkflowDemo";
// import { handleWsRequest } from "mtxuilib/routes/ws/wsApp";

import type { EndpointList, Env } from "mtmaiapi/gomtmapi/types.gen";
import { getEndpointList, initEdgeApp } from "./lib/sslib";
import { mainApp } from "./routes/edgeApi";
import { handleWsRequest } from "./routes/ws/wsApp";
export default {
  async fetch(request: Request, env, ctx) {
    //设置环境变量,达到兼容 nodejs 的目的
    for (const key in env) {
      if (typeof env[key] === "string") {
        process.env[key] = env[key];
      }
    }
    try {
      // console.log(`env:${JSON.stringify(env)}`);
      await initEdgeApp({});
      const responseFromApp = await mainApp.fetch(request, env, ctx);
      if (responseFromApp.status === 200) {
        return responseFromApp;
      }
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
  let endpointList: EndpointList | undefined = undefined;
  endpointList = await getEndpointList();

  if (!endpointList?.rows?.length) {
    // @ts-ignore
    process.env.DEFAULT_HFSPACE = env.DEFAULT_HFSPACE;
    console.log(`使用环境变量的默认值:${process.env.DEFAULT_HFSPACE}`);

    const uri = new URL(process.env.DEFAULT_HFSPACE);
    // 创建一个新的 URL，只保留协议、主机名和路径部分
    const cleanUrl = `${uri.protocol}//${uri.host}${uri.pathname}${uri.search}`;

    endpointList = {
      rows: [],
    };
    endpointList.rows.push({
      url: cleanUrl, // 使用清理后的 URL
      token: uri.password,
      metadata: {
        id: "default-hfspace",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      name: "default-hfspace",
      type: "hfspace",
    });
    console.log(`endpointList:${JSON.stringify(endpointList)}`);
  }
  //开发阶段使用第一条配置作为远程服务器的配置
  const targetEndpoint = endpointList.rows[0];
  const remoteUrl = targetEndpoint.url;
  const token = targetEndpoint.token;

  const url = new URL(r.url);
  const targetUrl = new URL(`${remoteUrl}${url.pathname}${url.search}`);
  targetUrl.password = undefined;
  targetUrl.username = undefined;
  const requestHeaders = new Headers(r.headers);
  requestHeaders.set("Authorization", `Bearer ${token}`);

  console.log(
    `🚀 [endpoint api proxy(v2)] ${r.method} ${targetUrl.toString()} len:${r.body?.length}`,
  );
  // Forward the request with same method, headers and body
  const response = await fetch(targetUrl.toString(), {
    method: r.method,
    headers: requestHeaders,
    body: ["GET", "HEAD"].includes(r.method) ? undefined : r.body,
  });
  return response;
};
