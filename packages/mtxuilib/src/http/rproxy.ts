export interface RProxyOptions {
	baseUrl: string;
	rewritePathFrom?: string;
	rewritePathTo?: string;
}
/**
 * 简易的反向 http 代理
 * @param options
 * @returns
 */
export function newRProxy(options: RProxyOptions) {
	// const { baseUrl } = options;
	const { baseUrl, rewritePathFrom, rewritePathTo } = options;
	return async (r: Request) => {
		const incomeUri = new URL(r.url);
		const incomePathname = incomeUri.pathname;
		let targetPath = incomeUri.pathname;

		// url rewrite
		if (
			rewritePathFrom &&
			rewritePathTo &&
			incomePathname.includes(rewritePathFrom)
		) {
			// Replace the matched portion of the incoming path with the target pattern
			targetPath = targetPath.replace(rewritePathFrom, rewritePathTo);
		}

		const fullUrl = new URL(baseUrl + targetPath);
		fullUrl.search = incomeUri.search;
		try {
			console.log(`rproxy => ${r.method} ${fullUrl}`);

			const xForwardHost =
				r.headers.get("x-forwarded-host") ||
				r.headers.get("host") ||
				fullUrl.hostname;
			const xForwardProto: string =
				r.headers.get("x-forwarded-proto") || fullUrl.protocol || "https";
			const fetchOptions = {
				method: r.method,
				headers: {
					...Object.fromEntries(r.headers.entries()),
					"x-forwarded-host": xForwardHost,
					"x-forwarded-proto": xForwardProto,
				},
				redirect: "manual" as const,
				...(r.body && { body: r.body }),
			};

			const response = await fetch(fullUrl, fetchOptions);
			if (response.status >= 300 && response.status < 400) {
				const location = response.headers.get("Location");
				if (location) {
					return new Response(null, {
						status: response.status,
						headers: {
							...Object.fromEntries(response.headers.entries()),
						},
					});
				}
			}
			return response;
		} catch (e) {
			return new Response(`error ${e} ${fullUrl.toString()}`);
		}
	};
}
