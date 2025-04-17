"use client";

import type React from "react";
import { createContext, useContext, useMemo, useTransition } from "react";
import { type StateCreator, createStore, useStore } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";
import { useTenantId } from "../hooks/useAuth";
import { useNav, useSearch } from "../hooks/useNav";

export interface ComponentsProps {
  componentId?: string;
}

export interface ComponentsState extends ComponentsProps {
  setComponentId: (componentId: string) => void;
  isPending: boolean;
  runComponent: () => void;
}

export const createWorkbrenchSlice: StateCreator<
  ComponentsState,
  [],
  [],
  ComponentsState
> = (set, get, init) => {
  return {
    isPending: false,
    componentId: "",
    setComponentId: (componentId: string) => {
      set({ componentId });
    },
    runComponent: () => {
      set({ isPending: true });
    },
    ...init,
  };
};

const createTeamSessionStore = (initProps?: Partial<ComponentsState>) => {
  return createStore<ComponentsState>()(
    subscribeWithSelector(
      // persist(
      devtools(
        immer((...a) => ({
          ...createWorkbrenchSlice(...a),
          ...initProps,
        })),
        {
          name: "team-session-store",
        },
      ),
    ),
  );
};
const componentsStoreContext = createContext<ReturnType<
  typeof createTeamSessionStore
> | null>(null);

export const TeamSessionProvider = (
  props: React.PropsWithChildren<ComponentsProps>,
) => {
  const { children, ...etc } = props;
  const tid = useTenantId();
  const nav = useNav();
  const [isPending, startTransition] = useTransition();
  const search = useSearch();
  const mystore = useMemo(
    () =>
      createTeamSessionStore({
        ...etc,
      }),
    [],
  );
  return (
    <componentsStoreContext.Provider value={mystore}>
      {children}
    </componentsStoreContext.Provider>
  );
};

const DEFAULT_USE_SHALLOW = false;
export function useTeamSessionStore(): ComponentsState;
export function useTeamSessionStore<T>(
  selector: (state: ComponentsState) => T,
): T;
export function useTeamSessionStore<T>(
  selector?: (state: ComponentsState) => T,
) {
  const store = useContext(componentsStoreContext);
  if (!store)
    throw new Error("useTeamSessionStore must in TeamSessionProvider");
  if (selector) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useStore(
      store,
      DEFAULT_USE_SHALLOW ? useShallow(selector) : selector,
    );
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useStore(store);
}
