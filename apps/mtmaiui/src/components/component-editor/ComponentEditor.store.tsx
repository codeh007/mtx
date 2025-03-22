"use client";

import type { MtComponent } from "mtmaiapi";
import type React from "react";
import { createContext, useContext, useMemo } from "react";
import { type StateCreator, createStore, useStore } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";

export interface EditPath {
  componentType: string;
  id: string;
  parentField: string;
  index?: number; // Added index for array items
}

export interface ComponentEditorProps {
  component: MtComponent;
  onChange: (updatedComponent: MtComponent) => void;
  onClose?: () => void;
  navigationDepth?: boolean;
}

export interface ComponentsProps {
  queryParams?: Record<string, any>;
}

export interface ComponentsState extends ComponentsProps {
  isPending: boolean;
  components: MtComponent[];
  setQueryParams: (queryParams: Record<string, any>) => void;
  isJsonEditing: boolean;
  setIsJsonEditing: (isJsonEditing: boolean) => void;
  editPath: EditPath[];
  setEditPath: (editPath: EditPath[]) => void;
  workingCopy: MtComponent;
  setWorkingCopy: (workingCopy: MtComponent) => void;
}

export const createComponentEditorStoreSlice: StateCreator<
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
    isJsonEditing: false,
    setIsJsonEditing: (isJsonEditing: boolean) => {
      set({ isJsonEditing });
    },
    editPath: [],
    setEditPath: (editPath: EditPath[]) => {
      set({ editPath });
    },
    workingCopy: {},
    setWorkingCopy: (workingCopy: MtComponent) => {
      set({ workingCopy });
    },
    ...init,
  };
};

const createComponentEditStore = (initProps?: Partial<ComponentsState>) => {
  return createStore<ComponentsState>()(
    subscribeWithSelector(
      // persist(
      devtools(
        immer((...a) => ({
          ...createComponentEditorStoreSlice(...a),
          ...initProps,
        })),
        {
          name: "components-editor-store",
        },
      ),
    ),
  );
};
const componentsStoreContext = createContext<ReturnType<
  typeof createComponentEditStore
> | null>(null);

export const ComponentEditProvider = (
  props: React.PropsWithChildren<ComponentsProps>,
) => {
  const { children, ...etc } = props;
  // const tid = useTenantId();
  // const nav = useNav();
  // const [isPending, startTransition] = useTransition();
  // const search = useSearch();
  // const [queryParams, setQueryParams] = useState({
  //   ...etc.queryParams,
  //   // ...search,
  // });
  const store = useMemo(
    () =>
      createComponentEditStore({
        ...etc,
        components: [],
        // isPending,
      }),
    [],
  );
  return (
    <componentsStoreContext.Provider value={store}>
      {children}
    </componentsStoreContext.Provider>
  );
};

const DEFAULT_USE_SHALLOW = false;
export function useComponentEditStore(): ComponentsState;
export function useComponentEditStore<T>(
  selector: (state: ComponentsState) => T,
): T;
export function useComponentEditStore<T>(
  selector?: (state: ComponentsState) => T,
) {
  const store = useContext(componentsStoreContext);
  if (!store)
    throw new Error("useComponentEditStore must in ComponentEditProvider");
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
