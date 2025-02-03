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

  // 预处理所有重写规则，创建匹配函数
  const rules = rewrites.map((rule) => ({
    ...rule,
    matcher: match(rule.from, { decode: decodeURIComponent }),
  }));

  return async (r: Request) => {
    const incomeUri = new URL(r.url);
    const incomePathname = incomeUri.pathname;
    let targetPath = incomePathname;
    let targetBaseUrl = baseUrl;

    // 使用 path-to-regexp 进行路径匹配
    for (const rule of rules) {
      const matchResult = rule.matcher(incomePathname);

      if (matchResult) {
        targetBaseUrl = rule.to;

        if (rule.rewrite) {
          // 使用匹配到的参数进行替换
          let toPath = rule.rewrite.to;
          for (const [key, value] of Object.entries(matchResult.params)) {
            toPath = toPath.replace(`:${key}`, value as string);
          }
          targetPath = toPath;
        } else {
          // 如果没有特定的重写规则，保持相同的参数结构
          targetPath = incomePathname;
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
      console.log(
        `🚀 [rProxy] ${r.method}(${response.status}) \n${r.url}, \n===> ${targetBaseUrl}${targetPath}`,
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
