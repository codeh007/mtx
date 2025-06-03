"use client";

export interface AndroidApi {
  getVersion: () => Promise<string>;
  toast: (message: string) => void;
  openSingbox: () => void;
}

export function isInWebview(): boolean {
  // @ts-ignore
  return typeof window !== "undefined" && window.mtmadbot;
}

export function getAndroidApi(): AndroidApi {
  if (typeof window === "undefined") {
    // return null;
    throw new Error("window is undefined");
  }
  // @ts-ignore
  if (!window.mtmadbot) {
    // return null;
    throw new Error("mtmadbot is undefined");
  }
  //@ts-ignore
  return window.mtmadbot as unknown as AndroidApi;
}
