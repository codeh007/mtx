import { getBackendUrl, initGomtmApp } from "mtmaiapi/gomtmapp";
import { newRProxy } from "mtxuilib/http/rproxy";

export const runtime = "edge";

/**
 * 业务api 反向代理
 */
const handler = async (r: Request) => {
  await initGomtmApp({ r: r });
  const rProxy = newRProxy({
    baseUrl: getBackendUrl(),
    rewrites: [
      {
        //https://colab-3600.yuepa8.com/api/v1/tenants/707d0855-80ab-4e1f-a156-f1c4546cbf52/chat
        from: "/api/v1/tenants/:tenant/chat",
        to: "http://localhost:7860/api/v1/tenants/:tenant/chat",
      },
      {
        from: "/api/v1/chat",
        to: "http://localhost:7860",
      },
      {
        from: /^\/api\/service2abde\/notexist/,
        to: "https://service2.example.com",
      },
    ],
  });
  return rProxy(r);
};

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
export const OPTIONS = handler;
export const HEAD = handler;
