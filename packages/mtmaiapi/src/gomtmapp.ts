import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import {
  type EndpointList,
  type FrontendConfig,
  endpointList,
  frontendGetConfig,
} from "./gomtmapi";
import { initMtiaiClient } from "./index";
// import { isInBuild } from "./util/sutils";

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
    host?.includes("localhost") ||
    host?.includes("ts.net") ||
    host?.startsWith("100.");
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
    cachedEndpointList = (await endpointList({})).data;
  } catch (e) {
    console.error(
      `getEndpointList error: ${e}, when backendUrl: ${await getBackendUrl()}`,
    );
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
    throw new Error(
      `get remote env error: ${response.statusText}, from url: ${envUrl}`,
    );
  }
  const envText = await response.text();
  const env = envText.split("\n").map((line) => line.trim());

  const skipsComment = ["#", "//"];
  //防止覆盖重要本地变量
  const skipsLocals = [
    "NEXT_BUILD_OUTPUT",
    "PORT",
    "MTMAI_BACKEND",
    "MTM_TOKEN",
  ];
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
  // if (isInBuild()) {
  //   console.warn("在build 阶段,不加载FrontendConfig远程前端配置");
  //   return {} as FrontendConfig;
  // }
  if (!cachedFrontendConfig) {
    try {
      cachedFrontendConfig = (await frontendGetConfig({})).data;
    } catch (e) {
      console.error(`getFrontendConfig error: ${e}`);
      cachedFrontendConfig = undefined;
    }
  }
  return cachedFrontendConfig;
}

export async function getAccessToken() {
  // if (isInBuild()) {
  //   console.warn("在build 阶段,不加载AccessToken");
  //   return "";
  // }
  return "";
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
  //   if (headers) {
  //     return (await headers()).get("host") || "localhost";
  //   }
  return "localhost";
}

// 服务初始化入口函数
export async function initGomtmApp(opts: {
  cookies?: () => Promise<ReadonlyRequestCookies>;
  headers?: () => Promise<Headers> | Headers;
  r: Request;
}) {
  if (typeof window !== "undefined") {
    return;
  }
  //   headers = opts.headers;
  //   cookies = opts.cookies;
  await initMtiaiClientV2();
}
