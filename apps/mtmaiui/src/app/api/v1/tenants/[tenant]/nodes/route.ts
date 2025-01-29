import { initGomtmApp } from "mtmaiapi/gomtmapp";

export const runtime = "edge";

/**
 * 业务api 反向代理
 */
const handler = async (r: Request) => {
  initGomtmApp({ r: r });
  const uri = new URL(r.url);

  const remoteUrl = "https://llama3-1-70b.lepton.run/api/v1/";
  return new Response(`Hello, agent run: ${uri.pathname}`);
};

export const GET = handler;
export const POST = handler;
