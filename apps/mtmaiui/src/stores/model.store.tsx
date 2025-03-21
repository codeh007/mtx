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
  content: React.ReactNode;
  setContent: (children: React.ReactNode) => void;
  header: React.ReactNode;
  setHeader: (children: React.ReactNode) => void;
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
    content: null,
    setContent: (children: React.ReactNode) => set({ content: children }),
    ...init,
  };
};

const createModalStore = (initProps?: Partial<ModalState>) => {
  return createStore<ModalState>()(
    subscribeWithSelector(
      // persist(
      devtools(
        immer((...a) => ({
          ...createModelStoreSlice(...a),
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
  const children = useModelStore((x) => x.content);

  const handleClose = () => {
    setOpen(false);
    window.history.back();
  };
  return (
    <Sheet open={open} onOpenChange={handleClose}>
      {children}
    </Sheet>
  );
};

interface TeamBuilderModelWrapperProps {
  children: React.ReactNode;
}
export function MtModal({ children }: TeamBuilderModelWrapperProps) {
  const setOpen = useModelStore((x) => x.setOpen);
  const setChildren = useModelStore((x) => x.setContent);
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setOpen(true);
    setChildren(children);
  }, []);
  return null;
}

interface ModelHeaderProps {
  children: React.ReactNode;
}
export const ModelHeader = ({ children }: ModelHeaderProps) => {
  return <SheetHeader>{children}</SheetHeader>;
};

interface ModelTitleProps {
  children: React.ReactNode;
}
export const ModelTitle = ({ children }: ModelTitleProps) => {
  return <SheetTitle>{children}</SheetTitle>;
};

interface ModelContentProps {
  children: React.ReactNode;
}
export const ModelContent = ({ children }: ModelContentProps) => {
  return (
    <SheetContent className="w-full sm:max-w-5xl">{children}</SheetContent>
  );
};
