import { formatDistanceToNowStrict } from "date-fns";

export function is_in_gitpod() {
  return process.env.GITPOD_WORKSPACE_URL !== undefined;
}

export function get_gitpod_workspace_url(port: number) {
  const gitpodWrokspaceHost = new URL(process.env.GITPOD_WORKSPACE_URL!)
    .hostname;
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

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
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
// export function isInDocker() {
// 	const fs = require("fs")
// 	return fs.existsSync("/.dockerenv");
// }

export function gitpodPreviewUrl(port: number) {
  const GITPOD_WORKSPACE_URL = process.env.GITPOD_WORKSPACE_URL || "";
  const uri = new URL(GITPOD_WORKSPACE_URL);
  const hostname = uri.hostname;
  return `https://${port}-${hostname}`;
}
// export const isSandbox = process.env.CSB_BASE_PREVIEW_HOST;
// export function getSendboxPreviewUrl(port: number) {
// 	return `${process.env.HOSTNAME}-${port}.${process.env.CSB_BASE_PREVIEW_HOST}`;
// }

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
export const capitalize = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);
export const uncapitalize = (string: string) =>
  string.charAt(0).toLowerCase() + string.slice(1);

export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const calculateDelay = (attempts: number): number =>
  Math.min(
    1000 * 2 ** Math.max(1, attempts) + Math.random() * 100,
    2 ** 31 - 1,
  );

export const getCurrentTimeZone = (): string =>
  Intl.DateTimeFormat().resolvedOptions().timeZone;

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
