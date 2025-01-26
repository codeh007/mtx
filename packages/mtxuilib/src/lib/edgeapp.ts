import {
  type EndpointList,
  type FrontendConfig,
  endpointList,
  frontendGetConfig,
  initMtiaiClient,
} from "mtmaiapi";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { isCI, isInBuild } from "./s-utils";

export class EdgeApp {
  private isInited = false;
  public hostName = "";
  public token?: string = undefined;
  public frontendConfig?: FrontendConfig = undefined;
  //业务后端列表
  public endpointList?: EndpointList = undefined;

  private cookies?: () => Promise<ReadonlyRequestCookies>;
  private headers?: () => Promise<Headers> | Headers;
  /**
   * 应用的初始化
   * 在 nextjs 中的 layout page route 页面中,需要调用此方法
   * @param opts
   * @returns
   */
  async init(opts: {
    cookies?: () => Promise<ReadonlyRequestCookies>;
    headers?: () => Promise<Headers> | Headers;
  }) {
    if (this.isInited) {
      console.log("edgeApp.init already inited");
      return;
    }
    this.token = process.env?.MTM_ADMIN_TOKEN;
    if (!this.token && !isCI() && !isInBuild()) {
      throw new Error("MTM_ADMIN_TOKEN is not set");
    }

    if (!this.token) {
      console.warn("⚠️ MTM_ADMIN_TOKEN is not set");
    }
    if (typeof window !== "undefined") {
      return;
    }
    this.headers = opts.headers;
    this.cookies = opts.cookies;
    initMtiaiClient(await this.getBackendUrl());
    this.isInited = true;
  }

  async getAccessToken() {
    if (isInBuild()) {
      console.warn("在build 阶段,不加载AccessToken");
      return "";
    }
    const frontendConfig = await this.getFrontendConfig();
    if (!frontendConfig) {
      throw new Error("get frontendConfig error");
    }
    const tokenName = frontendConfig?.cookieAccessToken;
    if (this.cookies) {
      return (await this.cookies()).get(tokenName)?.value || "";
    }
    return "";
  }

  async reset() {
    this.endpointList = undefined;
    this.frontendConfig = undefined;
  }

  // 获取当前服务器的url(通常是nextjs 运行的服务器地址)
  async getBackendUrl(prefix?: string) {
    if (process.env.MTM_BASE_URL) {
      return `${process.env.MTM_BASE_URL}${prefix}`;
    }
    if (process.env.MTMAI_BACKEND) {
      return `${process.env.MTMAI_BACKEND}${prefix}`;
    }
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}${prefix}`;
    }
    const host = this.hostName || "localhost";
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

  // 获取前端配置数据
  async getFrontendConfig() {
    if (isInBuild()) {
      console.warn("在build 阶段,不加载FrontendConfig远程前端配置");
      return {} as FrontendConfig;
    }
    if (!this.frontendConfig) {
      try {
        this.frontendConfig = (await frontendGetConfig({})).data;
      } catch (e) {
        console.error(`getFrontendConfig error: ${e}`);
        this.frontendConfig = undefined;
      }
    }
    return this.frontendConfig;
  }

  // 获取业务后端列表
  async getEndpointList() {
    if (!this.endpointList) {
      try {
        this.endpointList = (await endpointList({})).data;
      } catch (e) {
        console.error(
          `getEndpointList error: ${e}, when backendUrl: ${await this.getBackendUrl()}`,
        );
      }
    }
    return this.endpointList;
  }

  async loadRemoteEnv() {
    const envUrl = `${await this.getBackendUrl()}/api/v1/env/default`;
    const response = await fetch(envUrl, {
      headers: {
        Authorization: `Bearer ${this.token}`,
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
}

export const edgeApp = new EdgeApp();
