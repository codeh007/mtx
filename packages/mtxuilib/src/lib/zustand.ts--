"use client";
import type { StateStorage } from "zustand/middleware";
import type { StateCreator, StoreMutatorIdentifier } from "zustand/vanilla";
import { deleteCookie, getCookie, setCookie } from "./clientlib";

export const customCookieStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return getCookie(name) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await setCookie(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    deleteCookie(name);
  },
};
export const hashStorage: StateStorage = {
  getItem: (key): string => {
    const searchParams = new URLSearchParams(window.location.hash.slice(1));
    const storedValue = searchParams.get(key) ?? "";
    return JSON.parse(storedValue);
  },
  setItem: (key, newValue): void => {
    const searchParams = new URLSearchParams(window.location.hash.slice(1));
    searchParams.set(key, JSON.stringify(newValue));
    window.location.hash = searchParams.toString();
  },
  removeItem: (key): void => {
    const searchParams = new URLSearchParams(window.location.hash.slice(1));
    searchParams.delete(key);
    window.location.hash = searchParams.toString();
  },
};

export type ImmerStateCreator<
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
  U = T,
> = StateCreator<
  T,
  [...Mps, ["zustand/immer", never], ["zustand/devtools", never]],
  Mcs,
  U
>;
