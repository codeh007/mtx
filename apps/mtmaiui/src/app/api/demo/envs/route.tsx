import { cookies } from "next/headers";

import { headers } from "next/headers";
import { edgeApp } from "../../../../lib/edgeapp";

export const runtime = "edge";

//测试: 从总后端加载环境变量
const handler = async (r: Request) => {
  await edgeApp.reset();
  await edgeApp.init({
    getHeadersCb: async () => await headers(),
    getCookieCb: async (name: string) =>
      (await cookies()).get(name)?.value || "",
  });

  const endpointList = await edgeApp.getEndpointList();
  console.log(endpointList);

  return new Response("ok");
};

export const GET = handler;
export const POST = handler;
