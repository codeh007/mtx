export const runtime = "edge";
const handler = async (r: Request) => {
  const hfSpace = process.env.HF_SPACE;
  const hfToken = process.env.HF_TOKEN;

  const startResponse = await fetch(`https://${hfSpace}.hf.space/hello/world`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${hfToken}`,
    },
  });

  const response = await startResponse.json();
  return new Response(JSON.stringify(response), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const GET = handler;
export const POST = handler;
