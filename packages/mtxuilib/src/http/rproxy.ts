import { match } from "path-to-regexp";

export interface RewriteRule {
  from: string;
  to: string;
}

export interface RProxyOptions {
  rewrites?: RewriteRule[];
  headers?: Record<string, string>;
}

/**
 * 反向 http 代理
 * @param options
 * @returns
 */
export function newRProxy(options: RProxyOptions) {
  const { rewrites = [] } = options;

  // rewrite rules
  const rules = rewrites.map((rule) => ({
    ...rule,
    matcher: match(rule.from, { decode: decodeURIComponent }),
  }));

  return async (r: Request) => {
    const incomeUri = new URL(r.url);
    const incomePathname = incomeUri.pathname;
    let targetUrl = "";
    for (const rule of rules) {
      const matchResult = rule.matcher(incomePathname);
      if (matchResult) {
        let finalPath = rule.to;
        //位置参数
        for (const [index, value] of Object.entries(matchResult.params)) {
          const placeholder = `$${Number.parseInt(index) + 1}`;
          finalPath = finalPath.replace(placeholder, value as string);
        }
        //命名参数
        for (const [key, value] of Object.entries(matchResult.params)) {
          finalPath = finalPath.replace(`:${key}`, value as string);
        }
        targetUrl = finalPath;
        break;
      }
    }

    // final url
    const fullUrl = new URL(targetUrl);
    fullUrl.search = incomeUri.search;

    try {
      const requestHeaders = copyIncomeHeaders(r);
      const response = await fetch(fullUrl, {
        method: r.method,
        headers: requestHeaders,
        body: ["GET", "HEAD"].includes(r.method) ? undefined : r.body,
      });

      console.log(
        `🚀 [rProxy] ${r.method}(${response.status}) \n${r.url}, \n===> ${fullUrl.toString()}`,
      );
      return response;
    } catch (e) {
      return new Response(`error ${e} ${fullUrl.toString()}`);
    }
  };
}

const DEFAULT_EXCLUDED_HEADERS = [
  "host",
  "content-length",
  "x-forwarded-",
  "cf-",
  "connection",
  "sec-",
  "proxy-",
  "transfer-encoding",
];

/**
 * 复制请求头，但排除特定前缀的头部
 * @param request 原始请求
 * @param additionalExcludes 额外需要排除的头部前缀
 * @returns 新的 Headers 对象
 */
export function copyIncomeHeaders(
  request: Request,
  additionalExcludes: string[] = [],
): Headers {
  const excludedPrefixes = [...DEFAULT_EXCLUDED_HEADERS, ...additionalExcludes];

  return new Headers(
    Array.from(request.headers.entries()).filter(
      ([key]) =>
        !excludedPrefixes.some((prefix) =>
          key.toLowerCase().startsWith(prefix),
        ),
    ),
  );
}
