"use client";
import {
  type PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { type StateCreator, createStore, useStore } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
type MtxFormProps = {
  open?: boolean;
};

type ConfirmCallbackFnType = () => void;
export interface DeleteConformState extends MtxFormProps {
  setOpen: (open: boolean) => void;

  confirmCallback?: ConfirmCallbackFnType;
  setConfirmCallback: (confirmCallback: ConfirmCallbackFnType) => void;
}

export const createFormSlice: StateCreator<
  DeleteConformState,
  [],
  [],
  DeleteConformState
> = (set, get) => ({
  setOpen: (open) => set({ open }),
  setConfirmCallback: (confirmCallback) => set({ confirmCallback }),
});

const createDeleteConformStore = (initProps?: Partial<MtxFormProps>) => {
  return createStore<DeleteConformState>()(
    immer((...a) => ({
      ...createFormSlice(...a),
      ...initProps,
    })),
  );
};
type formStore = ReturnType<typeof createDeleteConformStore>;
const formContext = createContext<formStore | null>(null);

/** *************************************************************
 * 删除确认对话框
 * @param props
 * @returns
 ****************************************************************/
export const DeleteConfirmProvider = (
  props: PropsWithChildren<MtxFormProps>,
) => {
  const { children, ...etc } = props;
  const mystore = useMemo(() => createDeleteConformStore(etc), [etc]);
  return (
    <formContext.Provider value={mystore}>
      {children}
      <DeleteConfirmDlg />
    </formContext.Provider>
  );
};
function useDeleteConfirmStore<T>(
  selector: (state: DeleteConformState) => T,
): T {
  const store = useContext(formContext);
  if (!store) throw new Error("useDeleteConfirm Missing MtxFormProvider");
  return useStore(store, selector!);
}

export const useDeleteConfirm = () => {
  const setOpen = useDeleteConfirmStore((x) => x.setOpen);
  const setConfirmCallback = useDeleteConfirmStore((x) => x.setConfirmCallback);
  const show = useCallback(
    (props: {
      callback: () => void;
    }) => {
      setConfirmCallback(props.callback);
      setOpen(true);
    },
    [setConfirmCallback, setOpen],
  );
  return {
    show,
  };
};

export const DeleteConfirmDlg = () => {
  const open = useDeleteConfirmStore((x) => x.open);
  const setOpen = useDeleteConfirmStore((x) => x.setOpen);
  const confirmCallback = useDeleteConfirmStore((x) => x.confirmCallback);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>delete confirm</DialogTitle>
        <DialogDescription>will delete item, continue?</DialogDescription>
        <Button
          variant={"destructive"}
          onClick={async () => {
            setOpen(false);
            confirmCallback?.();
          }}
        >
          Continue
        </Button>
        <Button
          variant={"outline"}
          onClick={() => {
            setOpen(false);
            confirmCallback?.();
          }}
        >
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
};
