import { Hono } from "hono";
import type { EndpointList } from "mtmaiapi";
import { getEndpointList } from "../../lib/sslib";
export const spaceProxy = new Hono().all("/", async (c) => {
  try {
    const r = c.req.raw;
    let endpointList: EndpointList | undefined = undefined;
    endpointList = await getEndpointList();

    if (!endpointList?.rows?.length) {
      // @ts-ignore
      process.env.DEFAULT_HFSPACE = c.env.DEFAULT_HFSPACE;
      console.log(`使用环境变量的默认值:${process.env.DEFAULT_HFSPACE}`);

      const uri = new URL(process.env.DEFAULT_HFSPACE);
      // 创建一个新的 URL，只保留协议、主机名和路径部分
      const cleanUrl = `${uri.protocol}//${uri.host}${uri.pathname}${uri.search}`;

      endpointList = {
        rows: [],
      };
      endpointList.rows.push({
        url: cleanUrl,
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
    console.log(`targetEndpoint:${JSON.stringify(targetEndpoint)}`);
    const remoteUrl = targetEndpoint.url;
    const token = targetEndpoint.token;

    const requestHeaders = new Headers(r.headers);
    requestHeaders.set("Authorization", `Bearer ${token}`);

    console.log(
      `🚀 [space proxy(v1)] =>${r.method} ${remoteUrl.toString()}\n headers: ${JSON.stringify(
        requestHeaders.get("Authorization"),
      )}`,
    );
    const response = await fetch(remoteUrl.toString(), {
      method: r.method,
      headers: requestHeaders,
      body: ["GET", "HEAD"].includes(r.method) ? undefined : r.body,
    });
    return response;
  } catch (e) {
    return c.json({
      error: e as Error,
    });
  }
});
