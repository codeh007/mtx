import { match } from "path-to-regexp";

export interface RewriteRule {
  // 匹配的路径模式，支持 Express 风格的参数，如 /api/:param
  from: string;
  // 目标基础URL，如果提供则覆盖全局baseUrl
  to: string;
  // 可选的路径重写规则
  rewrite?: {
    from: string;
    to: string;
  };
}

export interface RProxyOptions {
  // baseUrl: string;
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

  // 预处理所有重写规则，创建匹配函数
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
        // 命名参数
        for (const [key, value] of Object.entries(matchResult.params)) {
          finalPath = finalPath.replace(`:${key}`, value as string);
        }
        targetUrl = finalPath;
        break;
      }
    }

    // 最终URL
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

const allExcludesHeaderPrefixes = [
  "host",
  "content-length",
  "x-forwarded-",
  "cf-",
];

/**
 * 复制请求头, 自动清理和修正headers
 * @param r
 * @param excludesHeaderPrefixes
 * @returns
 */
export function copyIncomeHeaders(
  r: Request,
  excludesHeaderPrefixes: string[] = [],
) {
  const requestHeaders = new Headers();
  r.headers.forEach((value, key) => {
    if (
      !allExcludesHeaderPrefixes
        .concat(excludesHeaderPrefixes)
        .some((prefix) => key.startsWith(prefix))
    ) {
      requestHeaders.set(key, value);
    }
  });
  return requestHeaders;
}
