import { headers } from "next/headers";

/**
 * @deprecated 请使用edgeApp.getBackendUrl()
 * @param prefix 
 * @returns 
 */
export const getBackendUrl = async (prefix?: string) => {
  if (process.env.MTM_BASE_URL) {
    return `${process.env.MTM_BASE_URL}${prefix || ""}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}${prefix || ""}`;
  }

  const host = (await headers()).get("host") || "localhost";
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
};
