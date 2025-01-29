import { initGomtmApp } from "mtmaiapi/gomtmapp";

export const runtime = "edge";

/**
 * 业务api 反向代理
 */
const handler = async (r: Request, { params }) => {
  initGomtmApp({ r: r });
  const uri = new URL(r.url);

  return new Response(
    `Hello, agent run: ${uri.pathname}, params: ${JSON.stringify(params)}`,
  );
};

export const GET = handler;
export const POST = handler;
