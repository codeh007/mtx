export interface RewriteRule {
  // 匹配的路径模式
  from: string | RegExp;
  // 目标基础URL，如果提供则覆盖全局baseUrl
  to: string;
  // 可选的路径重写规则
  rewrite?: {
    from: string;
    to: string;
  };
}

export interface RProxyOptions {
  baseUrl: string;
  rewrites?: RewriteRule[];
  headers?: Record<string, string>;
}
/**
 * 反向 http 代理
 * @param options
 * @returns
 */
export function newRProxy(options: RProxyOptions) {
  const { baseUrl, rewrites = [] } = options;

  return async (r: Request) => {
    const incomeUri = new URL(r.url);
    const incomePathname = incomeUri.pathname;
    let targetPath = incomePathname;
    let targetBaseUrl = baseUrl;

    // 检查是否匹配新的重写规则
    for (const rule of rewrites) {
      const isMatch =
        typeof rule.from === "string"
          ? incomePathname.includes(rule.from)
          : rule.from.test(incomePathname);

      if (isMatch) {
        targetBaseUrl = rule.to;
        // 如果定义了路径重写规则
        if (rule.rewrite) {
          targetPath = targetPath.replace(rule.rewrite.from, rule.rewrite.to);
        }
        break;
      }
    }

    const fullUrl = new URL(targetBaseUrl + targetPath);
    fullUrl.search = incomeUri.search;
    try {
      const requestHeaders = copyIncomeHeaders(r);
      const response = await fetch(fullUrl, {
        method: r.method,
        headers: requestHeaders,
        body: ["GET", "HEAD"].includes(r.method) ? undefined : r.body,
      });
      console.log(`🚀 [rProxy] ${r.method}(${response.status}) ${r.url}`);
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
