import { formatDistanceToNowStrict } from "date-fns";
import {
  type EndpointList,
  type FrontendConfig,
  // endpointList,
  // frontendGetConfig,
  initMtiaiClient,
} from "mtmaiapi";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

const gomtmBackendToken: string | undefined = undefined;
let cachedEndpointList: EndpointList | undefined = undefined;
let cachedFrontendConfig: FrontendConfig | undefined = undefined;
let headers: () => Promise<Headers> | Headers;
let cookies: () => Promise<ReadonlyRequestCookies>;

export function getBackendUrl(prefix = "") {
  if (process.env.MTMAI_BACKEND) {
    return `${process.env.MTMAI_BACKEND}${prefix}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}${prefix}`;
  }
  const host = process.env.MTMAI_BACKEND || "localhost";
  const port = Number(process.env.PORT) || 3000;

  const localHost =
    host?.includes("localhost") || host?.includes("ts.net") || host?.startsWith("100.");
  if (localHost) {
    return `http://${host}:${port}${prefix}`;
  }
  return `https://${host}:${port}${prefix}`;
}

export async function initMtiaiClientV2() {
  await initMtiaiClient({
    baseUrl: await getBackendUrl(),
  });
}

export async function getEndpointList() {
  if (cachedEndpointList) {
    return cachedEndpointList;
  }
  console.log(`getEndpointList, backendUrl: ${await getBackendUrl()}`);
  try {
    // cachedEndpointList = (await endpointList({})).data;
  } catch (e) {
    console.error(`getEndpointList error: ${e}, when backendUrl: ${await getBackendUrl()}`);
  }
}

export async function loadRemoteEnv() {
  const envUrl = `${await getBackendUrl()}/api/v1/env/default`;
  const response = await fetch(envUrl, {
    headers: {
      ...(gomtmBackendToken && {
        Authorization: `Bearer ${gomtmBackendToken}`,
      }),
    },
  });
  if (!response.ok) {
    throw new Error(`get remote env error: ${response.statusText}, from url: ${envUrl}`);
  }
  const envText = await response.text();
  const env = envText.split("\n").map((line) => line.trim());

  const skipsComment = ["#", "//"];
  //防止覆盖重要本地变量
  const skipsLocals = ["NEXT_BUILD_OUTPUT", "PORT", "MTMAI_BACKEND", "MTM_TOKEN"];
  for (const line of env) {
    const v = line.split("=");
    if (v.length !== 2) {
      continue;
    }
    const envName = v[0];
    if (skipsComment.includes(envName)) {
      continue;
    }
    if (skipsLocals.includes(envName)) {
      continue;
    }
    let envValue = line.split("=")[1];
    if (envValue) {
      envValue = envValue.trim();
      if (envValue.startsWith('"') && envValue.endsWith('"')) {
        envValue = envValue.substring(1, envValue.length - 1);
      }
      if (envValue.startsWith("'") && envValue.endsWith("'")) {
        envValue = envValue.substring(1, envValue.length - 1);
      }
      console.log(`⚠️ [remote] ${envName}=${envValue}`);
      process.env[envName] = envValue;
    }
  }
}

// 获取前端配置数据
export async function getFrontendConfig() {
  console.log("getFrontendConfig");
  if (isInBuild()) {
    console.warn("在build 阶段,不加载FrontendConfig远程前端配置");
    return {} as FrontendConfig;
  }
  if (!cachedFrontendConfig) {
    try {
      // cachedFrontendConfig = (await frontendGetConfig({})).data;
    } catch (e) {
      console.error(`getFrontendConfig error: ${e}`);
      cachedFrontendConfig = undefined;
    }
  }
  return cachedFrontendConfig;
}

export async function getAccessToken() {
  if (isInBuild()) {
    return "";
  }
  const cookies = await import("next/headers").then((x) => {
    return x.cookies();
  });
  return cookies.get("access_token")?.value || "";
}

export async function reset() {
  cachedEndpointList = undefined;
  cachedFrontendConfig = undefined;
}

// 获取当前 http 主机名
export async function getHostName() {
  if (typeof window !== "undefined") {
    return window.location.hostname;
  }
  if (headers) {
    return (await headers()).get("host") || "localhost";
  }
  return "localhost";
}

// 服务初始化入口函数
export async function initGomtmApp(opts: {
  cookies?: () => Promise<ReadonlyRequestCookies>;
  headers?: () => Promise<Headers> | Headers;
}) {
  if (typeof window !== "undefined") {
    return;
  }
  headers = opts.headers;
  cookies = opts.cookies;
  await initMtiaiClientV2();
}

export function is_in_gitpod() {
  return process.env.GITPOD_WORKSPACE_URL !== undefined;
}

export function get_gitpod_workspace_url(port: number) {
  const gitpodWrokspaceHost = new URL(process.env.GITPOD_WORKSPACE_URL!).hostname;
  const fullUrl = `https://${port}-${gitpodWrokspaceHost}`;
  return fullUrl;
}

export function formatDate(input: string | number): string {
  const date = new Date(input);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDollars(input: number): string {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    currencyDisplay: "narrowSymbol",
  }).format(input);
  return formatted;
}

export function dateToNow(input: number | Date): string {
  return formatDistanceToNowStrict(input);
}

/**
 * 字符数组去重,
 * 也可以用简单的方式： Array.from(new Set<string>(someStrings));
 * @param strings
 * @returns
 */
export const stringsUnique = (strings: string[]) => {
  return Array.from(new Set(strings));
};

export const isInVercel = () => {
  return process.env.VERCEL_PROJECT_ID;
};

export const randomString = (length: number) =>
  [...Array(length)].map(() => (~~(Math.random() * 36)).toString(36)).join("");

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export const delay = sleep;

export const isSsr = () => {
  return typeof window === "undefined";
};

export function isGitpod() {
  return process?.env?.GITPOD_WORKSPACE_URL;
}

export function isInColab() {
  return !!process.env.COLAB_KERNEL_MANAGER_PROXY_PORT;
}

export function gitpodPreviewUrl(port: number) {
  const GITPOD_WORKSPACE_URL = process.env.GITPOD_WORKSPACE_URL || "";
  const uri = new URL(GITPOD_WORKSPACE_URL);
  const hostname = uri.hostname;
  return `https://${port}-${hostname}`;
}

export function isCloudflarePage() {
  return process?.env?.CF_PAGES_URL;
}
export const isEdgeRuntime = () => {
  //@ts-ignore
  return typeof EdgeRuntime === "string";
};
export function isWebWorker() {
  //@ts-ignore
  return (
    typeof WorkerGlobalScope !== "undefined" &&
    //@ts-ignore
    self instanceof WorkerGlobalScope
  );
}

export const escapeStr = (name: string) => `"${name.replace(/"/g, '""')}"`;
export const capitalize = (string: string) => string.charAt(0).toUpperCase() + string.slice(1);
export const uncapitalize = (string: string) => string.charAt(0).toLowerCase() + string.slice(1);

export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const calculateDelay = (attempts: number): number =>
  Math.min(1000 * 2 ** Math.max(1, attempts) + Math.random() * 100, 2 ** 31 - 1);

export const getCurrentTimeZone = (): string => Intl.DateTimeFormat().resolvedOptions().timeZone;

export const dateToTimeStamp = (date: Date) => {
  return Math.floor(date.getTime() / 1000);
};

const actualNewline = `
`;

export const cleanContent = (content: string): string => {
  return content ? content.replace(/\\n/g, actualNewline) : "";
};

export const reverseCleanContent = (content: string): string => {
  return content ? content.replaceAll(actualNewline, "\n") : "";
};

export const newlineToCarriageReturn = (str: string) =>
  // str.replace(actualNewline, "\r\n");
  str.replace(actualNewline, [actualNewline, actualNewline].join(""));

export const emptyLineCount = (content: string): number => {
  const liens = content.split("\n");
  return liens.filter((line) => line.trim() === "").length;
};

export function isCI() {
  return process.env.CI === "true";
}
// export function isInVercel() {
//   return process.env.VERCEL === "true";
// }
export function isInBuild() {
  // return process.env.BUILD === "true";
  // It is called: process.env.NEXT_PHASE and it will be set to phase-production-build during build time.
  return process.env.NEXT_PHASE === "phase-production-build";
}
// formatDistanceToNowStrict,
