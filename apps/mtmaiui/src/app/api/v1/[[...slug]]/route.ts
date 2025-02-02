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
				from: "/api/v1/chat",
				to: "https://service1.example.com",
			},
			{
				from: /^\/api\/service2/,
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
