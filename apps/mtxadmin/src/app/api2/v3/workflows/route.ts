// 返回 mtmai copilot 的 js 引导脚本文件
const handler = async (r: Request) => {
  const res = await fetch(
    "https://api.cloudflare.com/client/v4/accounts/623faf72ee0d2af3e586e7cd9dadb72b/workflows",
    {
      headers: {
        Authorization: "Bearer w7ZVtnx7dUG9kwPQ6jJr4kzSvHi9MPRvY2BZVQTo",
        "Content-Type": "application/json",
      },
    },
  );
  const data = await res.json();
  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const GET = handler;
export const POST = handler;
