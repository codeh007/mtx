import { initGomtmApp } from "mtmaiapi/gomtmapp";
import { newRProxy } from "mtxuilib/http/rproxy";
import { createRouter } from "../../lib/createApp";

const gomtmProxyRouter = createRouter();

gomtmProxyRouter.all("/", async (c) => {
  const r = c.req.raw;
  await initGomtmApp({ r: r });
  const rProxy = newRProxy({
    rewrites: [
      {
        from: "/api/v1/tenants/:tenant/chat",
        to: "http://localhost:7860/api/v1/tenants/:tenant/chat",
      },
      {
        from: "/api/v1/(.*)",
        to: `${process.env.MTMAI_BACKEND}/api/v1/$1`,
      },
      {
        from: "/api/v1/run_sse/(.*)",
        to: "http://localhost:7860/api/v1/run_sse/$1",
      },
    ],
  });
  return rProxy(r);
});

export default gomtmProxyRouter;
