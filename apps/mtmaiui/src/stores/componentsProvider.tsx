"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import { type MtComponent, comsListOptions } from "mtmaiapi";
import type React from "react";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { type StateCreator, createStore, useStore } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";
import { useTenantId } from "../hooks/useAuth";
import { useNav, useSearch } from "../hooks/useNav";

export interface ComponentsProps {
  queryParams?: Record<string, any>;
}

export interface ComponentsState extends ComponentsProps {
  isPending: boolean;
  components: MtComponent[];
  setQueryParams: (queryParams: Record<string, any>) => void;
}

export const createWorkbrenchSlice: StateCreator<
  ComponentsState,
  [],
  [],
  ComponentsState
> = (set, get, init) => {
  return {
    isPending: false,
    setQueryParams: (queryParams: Record<string, any>) => {
      set({ queryParams });
    },
    ...init,
  };
};

type mtappStore = ReturnType<typeof createComponentsStore>;
const createComponentsStore = (initProps?: Partial<ComponentsState>) => {
  return createStore<ComponentsState>()(
    subscribeWithSelector(
      // persist(
      devtools(
        immer((...a) => ({
          ...createWorkbrenchSlice(...a),
          ...initProps,
        })),
        {
          name: "components-store",
        },
      ),
    ),
  );
};
const componentsStoreContext = createContext<mtappStore | null>(null);

export const ComponentsProvider = (
  props: React.PropsWithChildren<ComponentsProps>,
) => {
  const { children, ...etc } = props;
  const tid = useTenantId();
  const nav = useNav();
  const [isPending, startTransition] = useTransition();
  const search = useSearch();
  const [queryParams, setQueryParams] = useState({
    ...etc.queryParams,
    ...search,
  });
  const mystore = useMemo(
    () =>
      createComponentsStore({
        ...etc,
        components: [],
        isPending,
      }),
    [etc, isPending],
  );
  const componentsQuery = useSuspenseQuery({
    ...comsListOptions({
      path: {
        tenant: tid!,
      },
      query: {
        ...queryParams,
        ...search,
      },
    }),
  });
  mystore.subscribe(
    (state) => {
      return state.queryParams;
    },
    debounce((cur, prev) => {
      startTransition(() => {
        setQueryParams(cur);
        nav({ search: cur });
      });
    }, 500),
  );
  useEffect(() => {
    if (componentsQuery.data) {
      mystore.setState({
        components: componentsQuery.data.rows,
      });
    }
  }, [componentsQuery.data, mystore]);
  return (
    <componentsStoreContext.Provider value={mystore}>
      {children}
    </componentsStoreContext.Provider>
  );
};

const DEFAULT_USE_SHALLOW = false;
export function useComponentsStore(): ComponentsState;
export function useComponentsStore<T>(
  selector: (state: ComponentsState) => T,
): T;
export function useComponentsStore<T>(
  selector?: (state: ComponentsState) => T,
) {
  const store = useContext(componentsStoreContext);
  if (!store) throw new Error("useComponentsStore must in WorkbrenchProvider");
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
