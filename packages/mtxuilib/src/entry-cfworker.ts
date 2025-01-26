// export { WfHelloAssisant } from "mtxuilib/workflows/hello-assisant.ts";
// export { WfHelloToolUse } from "mtxuilib/workflows/hello-tooluse.ts";
export { MyWorkflow } from "./workflows/hello-workflow";
// export { WorkflowDemo } from "./workflows/WorkflowDemo";
// import { handleWsRequest } from "mtxuilib/routes/ws/wsApp";

import type { EndpointList } from "mtmaiapi/gomtmapi/types.gen";
// import { mainApp } from "mtxuilib/routes/edgeApi.ts";
import { edgeApp } from "./lib/edgeapp";
import { handleWsRequest } from "./routes/ws/wsApp";

export default {
  async fetch(request: Request, env, ctx) {
    try {
      const uri = new URL(request.url);
      if (uri.pathname.startsWith("/api/ws")) {
        return handleWsRequest(request, env, ctx);
      }
      // return mainApp.fetch(request, env, ctx);
      const response = await proxyHandler(request);
      return response;
    } catch (e) {
      return new Response(`unknown error:${(e as Error).message}`, {
        status: 500,
      });
    }
  },
};

/**
 * 业务api 反向代理
 */
const proxyHandler = async (r: Request) => {
  let errorMsg = "";
  try {
    await edgeApp.init({
      // headers: headers,
      // cookies: cookies,
    });
  } catch (e) {
    errorMsg = `edgeApp.init error:${(e as Error).message}`;
  }

  let endpointList: EndpointList | undefined = undefined;
  try {
    endpointList = await edgeApp.getEndpointList();

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
