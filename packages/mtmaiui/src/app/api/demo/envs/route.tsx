export const runtime = "edge";

//测试: 从总后端加载环境变量
const handler = async (r: Request) => {
  const backend = process.env.MTMAI_BACKEND;
  const token = process.env.MTM_TOKEN || "admin-1234567890";

  const fullUrl = `${backend}/api/v1/env/default`;
  console.log("fullUrl", fullUrl);
  const startResponse = await fetch(fullUrl, {
    headers: {
      // "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const content = await startResponse.text();
  return new Response(content);
};

export const GET = handler;
export const POST = handler;
