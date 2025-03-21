"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "mtxuilib/ui/sheet";

import type { Gallery } from "mtmaiapi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "mtxuilib/ui/dialog";
import { createContext, useContext, useEffect, useMemo } from "react";
import { type StateCreator, createStore, useStore } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";

export interface ModalProps {
  defaultGallery?: Gallery;
  galleries?: Gallery[];
}

type ModalVariant = "modal" | "sheet" | "drawer";
interface ModalState extends ModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  content: React.ReactNode;
  setContent: (children: React.ReactNode) => void;
  header: React.ReactNode;
  setHeader: (children: React.ReactNode) => void;
  variant: ModalVariant;
  setVariant: (variant: ModalVariant) => void;
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
    // content: null,
    // setContent: (children: React.ReactNode) => set({ content: children }),
    variant: "modal",
    setVariant: (variant: "modal" | "sheet") => set({ variant }),
    children: null,
    setChildren: (children: React.ReactNode) => set({ children }),
    // header: null,
    // setHeader: (header: React.ReactNode) => set({ header }),
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
  const variant = useModelStore((x) => x.variant);

  const handleClose = () => {
    setOpen(false);
    window.history.back();
  };
  if (variant === "modal") {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        {children}
      </Dialog>
    );
  }
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
  const variant = useModelStore((x) => x.variant);
  if (variant === "modal") {
    return <DialogHeader>{children}</DialogHeader>;
  }
  return <SheetHeader>{children}</SheetHeader>;
};

interface ModelTitleProps {
  children: React.ReactNode;
}
export const ModelTitle = ({ children }: ModelTitleProps) => {
  const variant = useModelStore((x) => x.variant);
  if (variant === "modal") {
    return <DialogTitle>{children}</DialogTitle>;
  }
  return <SheetTitle>{children}</SheetTitle>;
};

interface ModelContentProps {
  children: React.ReactNode;
}
export const ModelContent = ({ children }: ModelContentProps) => {
  const variant = useModelStore((x) => x.variant);
  if (variant === "modal") {
    return (
      <DialogContent className="w-full sm:max-w-5xl">{children}</DialogContent>
    );
  }
  return (
    <SheetContent className="w-full sm:max-w-5xl">{children}</SheetContent>
  );
};
