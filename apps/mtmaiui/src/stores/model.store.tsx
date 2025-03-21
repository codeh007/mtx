"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "mtxuilib/ui/sheet";

import type { Gallery } from "mtmaiapi";
import { createContext, useContext, useEffect, useMemo } from "react";
import { type StateCreator, createStore, useStore } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";

export interface ModalProps {
  defaultGallery?: Gallery;
  galleries?: Gallery[];
}

interface ModalState extends ModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
  setChildren: (children: React.ReactNode) => void;
}
export const createModelStoreSlice: StateCreator<
  ModalState,
  [],
  [],
  ModalState
> = (set, get, init) => {
  return {
    open: false,
    setOpen: (open: boolean) => set({ open }),
    children: null,
    setChildren: (children: React.ReactNode) => set({ children }),
    ...init,
  };
};

// type galleryStore = ReturnType<typeof createModalStore>;
// export type GalleryStoreState = ModalState;

const createModalStore = (initProps?: Partial<ModalState>) => {
  return createStore<ModalState>()(
    subscribeWithSelector(
      // persist(
      devtools(
        immer((...a) => ({
          ...createModelStoreSlice(...a),
          // ...createMessageParserSlice(...a),
          ...initProps,
        })),
        {
          name: "model-store",
        },
      ),
    ),
  );
};
const mtmaiStoreContext = createContext<ReturnType<
  typeof createModalStore
> | null>(null);

type AppProviderProps = React.PropsWithChildren<ModalProps>;
export const ModalProvider = (props: AppProviderProps) => {
  const { children, ...etc } = props;
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const mystore = useMemo(() => createModalStore(etc), [etc]);
  return (
    <mtmaiStoreContext.Provider value={mystore}>
      {children}
      <ModalDisplay />
    </mtmaiStoreContext.Provider>
  );
};

const DEFAULT_USE_SHALLOW = false;
export function useModelStore(): ModalState;
export function useModelStore<T>(selector: (state: ModalState) => T): T;
export function useModelStore<T>(selector?: (state: ModalState) => T) {
  const store = useContext(mtmaiStoreContext);
  if (!store) throw new Error("useModelStore must in ModalProvider");
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

const ModalDisplay = () => {
  const open = useModelStore((x) => x.open);
  const setOpen = useModelStore((x) => x.setOpen);
  const children = useModelStore((x) => x.children);

  return (
    <Sheet open={open} onOpenChange={() => setOpen(false)}>
      <SheetContent className="w-full sm:max-w-5xl">{children}</SheetContent>
    </Sheet>
  );
};

interface TeamBuilderModelWrapperProps {
  children: React.ReactNode;
}
export function ModelWrapper({ children }: TeamBuilderModelWrapperProps) {
  const setOpen = useModelStore((x) => x.setOpen);
  const setChildren = useModelStore((x) => x.setChildren);
  useEffect(() => {
    setOpen(true);
    setChildren(<div>hello</div>);
  }, [setOpen, setChildren]);

  return (
    <>
      <SheetHeader>
        <SheetTitle>Edit Component</SheetTitle>
      </SheetHeader>
      <div className="bg-blue-400 p-2">{children}</div>
    </>
  );
}
