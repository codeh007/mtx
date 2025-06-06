import type { CoreAssistantMessage, CoreMessage, CoreToolMessage, Message } from "ai";
import { type ClassValue, clsx } from "clsx";
import { isNumber, isString } from "lodash";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ClassNamesArg = undefined | string | Record<string, boolean> | ClassNamesArg[];

/**
 * A simple JavaScript utility for conditionally joining classNames together.
 *
 * @param args A series of classes or object with key that are class and values
 * that are interpreted as boolean to decide whether or not the class
 * should be included in the final class.
 */
export function classNames(...args: ClassNamesArg[]): string {
  let classes = "";

  for (const arg of args) {
    classes = appendClass(classes, parseValue(arg));
  }

  return classes;
}

function parseValue(arg: ClassNamesArg) {
  if (typeof arg === "string" || typeof arg === "number") {
    return arg;
  }

  if (typeof arg !== "object") {
    return "";
  }

  if (Array.isArray(arg)) {
    return classNames(...arg);
  }

  let classes = "";

  for (const key in arg) {
    if (arg[key]) {
      classes = appendClass(classes, key);
    }
  }

  return classes;
}

function appendClass(value: string, newClass: string | undefined) {
  if (!newClass) {
    return value;
  }

  if (value) {
    return `${value} ${newClass}`;
  }

  return value + newClass;
}

export function newUniqueId() {
  return randomString(10);
}

export function formatDate(input: string | number): string {
  const date = new Date(input);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
export const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};
export const getCreatedAfterFromTimeRange = (timeRange?: string) => {
  switch (timeRange) {
    case "1h":
      return new Date(Date.now() - 60 * 60 * 1000).toISOString();
    case "6h":
      return new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();
    case "1d":
      return new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    case "7d":
      return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  }
};

// dateUtils.ts
export function getRelativeTimeString(date: string | number | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diffInMs = now.getTime() - past.getTime();

  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInSeconds < 60) {
    return "just now";
  }
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
  }
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
  }
  if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
  }
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`;
  }

  return `${diffInYears} ${diffInYears === 1 ? "year" : "years"} ago`;
}
//非常简短的随机字符串生成代码。
export const randomString = (length: number) =>
  [...Array(length)].map(() => (~~(Math.random() * 36)).toString(36)).join("");

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
}

export function formatDollars(input: number): string {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    currencyDisplay: "narrowSymbol",
  }).format(input);
  return formatted;
}

export function capitalize(input: string) {
  return input.charAt(0).toUpperCase() + input.slice(1);
}

export function cleanSearchParams(urlSearchParams: URLSearchParams) {
  const cleanedParams = urlSearchParams;
  const keysForDel: string[] = [];

  urlSearchParams.forEach((value, key) => {
    if (value === "null" || value === "undefined" || !value) {
      keysForDel.push(key);
    }
  });

  // biome-ignore lint/complexity/noForEach: <explanation>
  keysForDel.forEach((key) => {
    cleanedParams.delete(key);
  });

  return cleanedParams;
}

export function searchString(page: string, search: string, sort: string): string {
  const searchParameters = new URLSearchParams({
    page,
    search,
    sort,
  });

  return cleanSearchParams(searchParameters)?.toString();
}

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export const delay = sleep;
/**
 * 模拟文件下载
 */
export function browserDownload(content: Blob | string, filename: string) {
  let blobContent = content;
  if (typeof content === "string") {
    blobContent = new Blob([content], {
      type: "text/plain",
    });
  }
  const url = URL.createObjectURL(blobContent as Blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "download";
  const clickHandler = () => {
    setTimeout(() => {
      URL.revokeObjectURL(url);
      a.removeEventListener("click", clickHandler);
    }, 150);
  };
  a.addEventListener("click", clickHandler, false);
  a.click();
  return a;
}

export async function ReadFileBase64Str(file: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onabort = () => reject("read file string abort");
    reader.onerror = (error) => reject(error);
    reader.onload = () => {
      resolve(window.btoa(reader.result as string));
    };
    reader.readAsBinaryString(file);
  });
}
export async function ReadFileStr(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onabort = () => reject("read file string abort");
    reader.onerror = (error) => reject(error);
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.readAsText(file, "utf-8");
  });
}

export const DataFormat = (date: number) => {
  const _date = new Date(date); // yyyy-MM-dd
  return `${_date.getFullYear()}-${_date.getMonth() + 1}-${_date.getDate()}`;
};
export const DataFormatWithSeconds = (date: number) => {
  const _date = new Date(date); // yyyy-MM-dd
  return `${_date.getFullYear()}-${
    _date.getMonth() + 1
  }-${_date.getDate()}-${_date.getHours()}-${_date.getMinutes()}-${_date.getSeconds()}`;
};

export const isEdgeRuntime = () => {
  //@ts-ignore
  return typeof EdgeRuntime === "string";
};

export const convertToArray = <T>(maybeArray: T | T[]): T[] => {
  return Array.isArray(maybeArray) ? maybeArray : [maybeArray];
};

//将对象转换为  URLSearchParams
//@ts-ignore
export const ConvertToSearchParams = (value) => {
  //@ts-ignore
  const obj = Object.keys(value).reduce((pre, k) => {
    const v = value[k].toString();
    if (v) {
      // 像 "0", 之类的空白参数，就没必要反应到url上。
      if (isNumber(v) && v > 0) {
        //@ts-ignore
        // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
        return { ...pre, [k]: value[k].toString() };
      }
      //@ts-ignore
      if (isString(v) && v !== "0" && v !== "false") {
        //字符串
        // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
        return { ...pre, [k]: value[k].toString() };
      }
    } else {
      return pre;
    }
  }, {});

  return new URLSearchParams(obj);
};

export const splitMethodsParts = (methodName: string) => {
  /**
   * 这段代码首先使用正则表达式 /(?=[A-Z])/ 将字符串分割为多个部分，该正则表达式表示在大写字母之前进行分割。
   * 然后，使用 map 方法将分割得到的部分转换为小写形式。
   * 输入："CxConfigList" 可得到 ["cx", "config", "list"]。
   */
  const parts = methodName.split(/(?=[A-Z])/).map((part) => part.toLowerCase());
  return parts;
};

export function transUrlLink(url: string) {
  try {
    const uri = new URL(url);
    if (uri.host === "localhost") {
      return `${uri.pathname}?${uri.searchParams.toString()}`;
    }
    return url;
  } catch (e) {}
  return url;
}

export const isJsonResponse = (res: Response) => {
  const contentType = res.headers.get("Content-Type");
  return !!contentType?.includes("json");
};

/**
 * 将下划线 之类的符号去掉，更适合人阅读的字符串
 * 还有待改进。
 *
 * 例子： humanize("abc-efg_hij.klm") 输出： "Abc Efg Hij Klm";
 * @param input
 *
 * @returns
 */
export function humanize(input: string): string {
  return input.replace(/[-_.]+/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}

export function stringsRemovePrefix(inputString: string, prefix: string) {
  if (inputString.startsWith(prefix)) {
    return inputString.substring(prefix.length);
  }
  return inputString;
}

export async function fetcher<JSON>(input: RequestInfo, init?: RequestInit): Promise<JSON> {
  const res = await fetch(input, init);

  if (!res.ok) {
    const json = (await res.json()) as any;
    if (json.error) {
      const error = new Error(json.error) as Error & {
        status: number;
      };
      error.status = res.status;
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }

  return res.json();
}

export const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

export const runAsyncFnWithoutBlocking = (
  //@ts-ignore
  fn: (...args) => Promise,
) => {
  fn();
};

export const getStringFromBuffer = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

export enum ResultCode {
  InvalidCredentials = "INVALID_CREDENTIALS",
  InvalidSubmission = "INVALID_SUBMISSION",
  UserAlreadyExists = "USER_ALREADY_EXISTS",
  UnknownError = "UNKNOWN_ERROR",
  UserCreated = "USER_CREATED",
  UserLoggedIn = "USER_LOGGED_IN",
}

export const getMessageFromCode = (resultCode: string) => {
  switch (resultCode) {
    case ResultCode.InvalidCredentials:
      return "Invalid credentials!";
    case ResultCode.InvalidSubmission:
      return "Invalid submission, please try again!";
    case ResultCode.UserAlreadyExists:
      return "User already exists, please log in!";
    case ResultCode.UserCreated:
      return "User created, welcome!";
    case ResultCode.UnknownError:
      return "Something went wrong, please try again!";
    case ResultCode.UserLoggedIn:
      return "Logged in!";
  }
};

/**
 * 将 JSON 字符串复制到剪切板
 * @param {string} jsonStr - 要复制的 JSON 字符串
 */

export const copyClipboard = (obj: unknown) => {
  if (typeof obj === "object") {
    navigator.clipboard.writeText(JSON.stringify(obj, null, 2));
    return;
  }
  navigator.clipboard.writeText(obj as string);
};

export function isObject(object: unknown) {
  return object != null && typeof object === "object";
}

export function deepEqual(object1: Record<string, any>, object2: Record<string, any>) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const val1 = object1[key];
    const val2 = object2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if ((areObjects && !deepEqual(val1, val2)) || (!areObjects && val1 !== val2)) {
      return false;
    }
  }

  return true;
}

export const httpUrlToWsUrl = (url: string) => {
  return url.replace(/^http:\/\//, "ws://").replace(/^https:\/\//, "wss://");
};

export function relativeDate(date?: string | number) {
  if (!date) {
    return "N/A";
  }

  const rtf = new Intl.RelativeTimeFormat("en", {
    localeMatcher: "best fit", // other values: "lookup"
    numeric: "auto", // other values: "auto"
    style: "long", // other values: "short" or "narrow"
  });

  const time = timeFrom(date);
  if (!time) {
    return "N/A";
  }

  let value = time.time;

  if (time.when === "past") {
    value = -value;
  }

  return capitalize(rtf.format(value, time.unitOfTime));
}

export function timeFrom(time: string | number, secondTime?: string | number) {
  // Get timestamps
  const unixTime = new Date(time).getTime();
  if (!unixTime) {
    return;
  }

  let now = new Date().getTime();

  if (secondTime) {
    now = new Date(secondTime).getTime();
  }

  // Calculate difference
  let difference = unixTime / 1000 - now / 1000;

  // Setup return object
  const tfn: {
    when: "past" | "now" | "future";
    unitOfTime: Intl.RelativeTimeFormatUnit;
    time: number;
  } = {
    when: "now",
    unitOfTime: "seconds",
    time: 0,
  };

  // Check if time is in the past, present, or future
  if (difference > 0) {
    tfn.when = "future";
  } else if (difference < -1) {
    tfn.when = "past";
  }

  // Convert difference to absolute
  difference = Math.abs(difference);

  // Calculate time unit
  if (difference / (60 * 60 * 24 * 365) > 1) {
    // Years
    tfn.unitOfTime = "years";
    tfn.time = Math.floor(difference / (60 * 60 * 24 * 365));
  } else if (difference / (60 * 60 * 24 * 45) > 1) {
    // Months
    tfn.unitOfTime = "months";
    tfn.time = Math.floor(difference / (60 * 60 * 24 * 45));
  } else if (difference / (60 * 60 * 24) > 1) {
    // Days
    tfn.unitOfTime = "days";
    tfn.time = Math.floor(difference / (60 * 60 * 24));
  } else if (difference / (60 * 60) > 1) {
    // Hours
    tfn.unitOfTime = "hours";
    tfn.time = Math.floor(difference / (60 * 60));
  } else if (difference / 60 > 1) {
    // Minutes
    tfn.unitOfTime = "minutes";
    tfn.time = Math.floor(difference / 60);
  } else {
    // Seconds
    tfn.unitOfTime = "seconds";
    tfn.time = Math.floor(difference);
  }

  // Return time from now data
  return tfn;
}

export function formatDuration(ms: number): string {
  if (ms < 0) {
    return "0s";
  }

  if (ms < 1000) {
    return `${ms}ms`;
  }
  if (ms < 60000) {
    return `${(ms / 1000).toFixed(1)}s`;
  }
  if (ms < 3600000) {
    return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
  }
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${hours}h ${minutes}m ${seconds}s`;
}
export function timeBetween(start: string | number, end: string | number) {
  const startUnixTime = new Date(start).getTime();
  const endUnixTime = new Date(end).getTime();

  if (!startUnixTime || !endUnixTime) {
    return;
  }

  // Calculate difference
  const difference = endUnixTime - startUnixTime;

  return formatDuration(difference);
}

// export function capitalize(s: string) {
//   if (!s) {
//     return "";
//   }
//   if (s.length === 0) {
//     return s;
//   }
//   if (s.length === 1) {
//     return s.charAt(0).toUpperCase();
//   }

//   return s.charAt(0).toUpperCase() + s.substring(1).toLowerCase();
// }
export async function copyText(text: string): Promise<void> {
  if ("clipboard" in navigator) {
    return navigator.clipboard.writeText(text);
    // biome-ignore lint/style/noUselessElse: <explanation>
  } else {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const success = document.execCommand("copy");
    document.body.removeChild(textArea);
    if (success) {
      return Promise.resolve();
      // biome-ignore lint/style/noUselessElse: <explanation>
    } else {
      return Promise.reject();
    }
  }
}

export function basicTimeFormat(time: string): string {
  const date = new Date(time);
  const dateString = date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const timeString = date.toLocaleTimeString("en-US");
  return `${dateString} at ${timeString}`;
}

export function timeFormatWithShortDate(time: string): string {
  const date = new Date(time);
  const dateString = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  const timeString = date.toLocaleTimeString("en-US");
  return `${dateString} at ${timeString}`;
}

export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function stripIndents(value: string): string;
export function stripIndents(strings: TemplateStringsArray, ...values: any[]): string;

export function stripIndents(arg0: string | TemplateStringsArray, ...values: any[]) {
  if (typeof arg0 !== "string") {
    const processedString = arg0.reduce((acc, curr, i) => {
      const newAcc = acc + curr + (values[i] ?? "");
      return newAcc;
    }, "");

    return _stripIndents(processedString);
  }

  return _stripIndents(arg0);
}

function _stripIndents(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .trimStart()
    .replace(/[\r\n]$/, "");
}

/**
 * 用 SHA-256 计算hash值后，用 a-zA-Z的字符表示最终的值
 * @param message
 * @returns
 */
export async function sha256WithAlphabets(message: unknown) {
  const buffer =
    typeof message === "object"
      ? new TextEncoder().encode(JSON.stringify(message))
      : new TextEncoder().encode(message as string);
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  // 将哈希值转换为 Base64 编码
  const hashBase64 = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
  // 从 Base64 编码的字符串中提取字母部分
  const alphabetsOnly = hashBase64.replace(/[^a-zA-Z]/g, "");
  return alphabetsOnly;
}

export async function defaultHash(message: unknown) {
  const hash = await sha256WithAlphabets(message);
  return hash.slice(0, 16);
}

// export function setLocalStorage(name: string, value: unknown, stringify = true) {
//   if (stringify) {
//     localStorage.setItem(name, JSON.stringify(value));
//   } else {
//     localStorage.setItem(name, value as string);
//   }
// }

// export function getLocalStorage(name: string, stringify = true) {
//   if (typeof window !== "undefined") {
//     const value = localStorage.getItem(name);
//     try {
//       if (stringify) {
//         return JSON.parse(value!);
//       }
//       return value;
//     } catch (e) {
//       return null;
//     }
//   } else {
//     return null;
//   }
// }

export function eraseCookie(name: string) {
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}

// export function truncateText(text: string, length = 50) {
//   if (text.length > length) {
//     return `${text.substring(0, length)} ...`;
//   }
//   return text;
// }

export function camelToDashCase(input: string) {
  return input.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

export function safeJsonStringify(input: unknown): string {
  if (typeof input === "object" && input !== null) {
    return JSON.stringify(input);
  }
  return input as string;
}

interface ApplicationError extends Error {
  info: string;
  status: number;
}

// export const fetcher = async (url: string) => {
//   const res = await fetch(url);

//   if (!res.ok) {
//     const error = new Error("An error occurred while fetching the data.") as ApplicationError;

//     error.info = await res.json();
//     error.status = res.status;

//     throw error;
//   }

//   return res.json();
// };

export function getLocalStorage(name: string, stringify = true): any {
  if (typeof window !== "undefined") {
    const value = localStorage.getItem(name);
    try {
      if (stringify) {
        return JSON.parse(value!);
      }
      return value;
    } catch (e) {
      return null;
    }
  } else {
    return null;
  }
}
export function setLocalStorage(name: string, value: any, stringify = true) {
  if (stringify) {
    localStorage.setItem(name, JSON.stringify(value));
  } else {
    localStorage.setItem(name, value);
  }
}

export function sanitizeResponseMessages(
  messages: Array<CoreToolMessage | CoreAssistantMessage>,
): Array<CoreToolMessage | CoreAssistantMessage> {
  const toolResultIds: Array<string> = [];

  for (const message of messages) {
    if (message.role === "tool") {
      for (const content of message.content) {
        if (content.type === "tool-result") {
          toolResultIds.push(content.toolCallId);
        }
      }
    }
  }

  const messagesBySanitizedContent = messages.map((message) => {
    if (message.role !== "assistant") return message;

    if (typeof message.content === "string") return message;

    const sanitizedContent = message.content.filter((content) =>
      content.type === "tool-call"
        ? toolResultIds.includes(content.toolCallId)
        : content.type === "text"
          ? content.text.length > 0
          : true,
    );

    return {
      ...message,
      content: sanitizedContent,
    };
  });

  return messagesBySanitizedContent.filter((message) => message.content.length > 0);
}

export function sanitizeUIMessages(messages: Array<Message>): Array<Message> {
  const messagesBySanitizedToolInvocations = messages.map((message) => {
    if (message.role !== "assistant") return message;

    if (!message.toolInvocations) return message;

    const toolResultIds: Array<string> = [];

    for (const toolInvocation of message.toolInvocations) {
      if (toolInvocation.state === "result") {
        toolResultIds.push(toolInvocation.toolCallId);
      }
    }

    const sanitizedToolInvocations = message.toolInvocations.filter(
      (toolInvocation) =>
        toolInvocation.state === "result" || toolResultIds.includes(toolInvocation.toolCallId),
    );

    return {
      ...message,
      toolInvocations: sanitizedToolInvocations,
    };
  });

  return messagesBySanitizedToolInvocations.filter(
    (message) =>
      message.content.length > 0 || (message.toolInvocations && message.toolInvocations.length > 0),
  );
}

export function getMostRecentUserMessage(messages: Array<CoreMessage>) {
  const userMessages = messages.filter((message) => message.role === "user");
  return userMessages.at(-1);
}

// export function getDocumentTimestampByIndex(
//   documents: Array<Document>,
//   index: number,
// ) {
//   if (!documents) return new Date();
//   if (index > documents.length) return new Date();

//   return documents[index].createdAt;
// }

// export function getMessageIdFromAnnotations(message: Message) {
//   if (!message.annotations) return message.id;

//   const [annotation] = message.annotations;
//   if (!annotation) return message.id;

//   // @ts-expect-error messageIdFromServer is not defined in MessageAnnotation
//   return annotation.messageIdFromServer;
// }

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

export function truncateText(text: string, length = 50) {
  if (text.length > length) {
    return `${text.substring(0, length)} ...`;
  }
  return text;
}
