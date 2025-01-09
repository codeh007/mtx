"use client";
import { createContext, useContext, useMemo, type PropsWithChildren } from "react";
import { createStore, useStore, type StateCreator } from "zustand";
type GlobalSearchProps = {};

export interface GlobalSearchState extends GlobalSearchProps {
  q?: string;
  setQ?: (q: string) => void;
}

export const createFormSlice: StateCreator<GlobalSearchState, [], [], GlobalSearchState> = (set, get) => ({
  setQ: (q) => set({ q }),
});

const createDeleteConformStore = (initProps?: Partial<GlobalSearchProps>) => {
  return createStore<GlobalSearchState>()((...a) => ({
    ...createFormSlice(...a),
    ...initProps,
  }));
};
type formStore = ReturnType<typeof createDeleteConformStore>;
const formContext = createContext<formStore | null>(null);

/** *************************************************************
 * 全局关键字搜索，（ TODO: 可以考虑跟 cmdk 集成）
 * @param props
 * @returns
 ****************************************************************/
export const GlobalSearchProvider = (props: PropsWithChildren<GlobalSearchProps>) => {
  const { children, ...etc } = props;
  const mystore = useMemo(() => createDeleteConformStore(etc), [etc]);
  return (
    <formContext.Provider value={mystore}>
      {children}
      {/* <DeleteConfirmDlg /> */}
    </formContext.Provider>
  );
};
export function useGlobalSearch<T>(selector: (state: GlobalSearchState) => T): T {
  const store = useContext(formContext);
  if (!store) throw new Error("useGlobalSearch Missing GlobalSearchProvider");
  return useStore(store, selector!);
}
