"use client";

export interface MtadbotRawApi {
  getVersion: () => Promise<string>;
  getInfo: () => Promise<string>;
  toast: (message: string) => void;
  openSingbox: () => void;
  addSangBoxProfile: (profileUrl: string) => Promise<string>;
  activateNetworkProfile: (profileName: string) => Promise<string>;
}

export function isInWebview(): boolean {
  // @ts-ignore
  return typeof window !== "undefined" && window.mtmadbot;
}

export function getAndroidApi(): MtadbotRawApi {
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
  return window.mtmadbot as unknown as MtadbotRawApi;
}
