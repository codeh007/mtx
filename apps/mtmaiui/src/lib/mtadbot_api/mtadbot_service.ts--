"use client";

export const MtadbotConsts = {
  DefaultSingBoxProfileName: "default",
};

export interface MtadbotRawApi {
  getVersion: () => Promise<string>;
  getInfo: () => Promise<string>;
  toast: (message: string) => void;
  openSingbox: () => void;
  addSangBoxProfile: (profileUrl: string) => Promise<string>;
  activateNetworkProfile: (profileName: string) => Promise<string>;
  shell: (command: string) => Promise<string>;

  // 临时的:
  openFloatWindow: () => Promise<string>;
  closeFloatWindow: () => Promise<string>;
  enableAdbWifi: () => Promise<string>;
}

export function isInMtAdbotService(): boolean {
  // @ts-ignore
  return typeof window !== "undefined" && window.mtadbotService;
}

export function getMtAdbotServiceApi(): MtadbotRawApi {
  if (typeof window === "undefined") {
    // return null;
    throw new Error("window is undefined");
  }
  // @ts-ignore
  if (!window.mtadbotService) {
    // return null;
    throw new Error("mtadbotService is undefined");
  }
  //@ts-ignore
  return window.mtadbotService as unknown as MtadbotRawApi;
}
