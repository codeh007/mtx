import { frontendGetConfig, initMtiaiClient } from "mtmaiapi";

export class EdgeApp {
  private isInited = false;
  public hostName = "";
  public backend = "";
  public token = "";
  public frontendConfig: any = undefined;
  constructor() {
    if (!this.backend) {
      this.backend = process.env.MTMAI_BACKEND || "";
    }
    if (!this.token) {
      this.token = process.env.MTM_ADMIN_TOKEN || "admin-token";
    }
  }
  private getCookies?: (name: string) => Promise<string> | string;

  /**
   * 应用的初始化
   * 在 nextjs 中的 layout page route 页面中,需要调用此方法
   * @param opts
   * @returns
   */
  async init(opts: {
    getAccessTokenCb?: () => Promise<string> | string;
    getCookieCb?: (name: string) => Promise<string> | string;
    getHeadersCb?: () => Promise<Headers> | Headers;
  }) {
    if (this.isInited) {
      return;
    }
    if (typeof window !== "undefined") {
      return;
    }
    if (opts.getHeadersCb) {
      const headers = await opts.getHeadersCb();
      this.hostName = headers.get("host")!;
    }
    this.getCookies = opts.getCookieCb;
    if (opts.getAccessTokenCb) {
      this.token = await opts.getAccessTokenCb();
    }
    const response = await fetch(`${this.backend}/api/v1/env/default`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
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
      const envName = line.split("=")[0];
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

    initMtiaiClient();
    this.isInited = true;
  }

  async getAccessToken() {
    const tokenName = (await this.getFrontendConfig()).cookieAccessToken;
    if (this.getCookies) {
      return this.getCookies(tokenName);
    }
    return "";
  }

  // 获取当前服务器的url(通常是nextjs 运行的服务器地址)
  async getBackendUrl(prefix?: string) {
    if (process.env.MTM_BASE_URL) {
      return `${process.env.MTM_BASE_URL}${prefix || ""}`;
    }
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}${prefix || ""}`;
    }
    const host = this.hostName;
    const port = Number(process.env.PORT) || 3000;
    //本地ip(或tailscale 内网ip)
    if (
      host?.includes("localhost") ||
      host?.includes("ts.net") ||
      host?.startsWith("100.")
    ) {
      return `http://${host}${prefix || ""}`;
    }
    if (host) {
      return `https://${host}${prefix || ""}`;
    }

    if (process.env.GITPOD_WORKSPACE_URL) {
      const gitpodWrokspaceHost = new URL(process.env?.GITPOD_WORKSPACE_URL)
        .hostname;
      return `https://${port}-${gitpodWrokspaceHost}${prefix || ""}`;
    }

    return `http://${host}:${port}${prefix || ""}`;
  }

  // 获取进一步发配置数据
  async getFrontendConfig() {
    if (!this.frontendConfig) {
      const frontendConfigResponse = await frontendGetConfig({});
      this.frontendConfig = frontendConfigResponse.data;
    }
    return this.frontendConfig;
  }
}

export const edgeApp = new EdgeApp();
