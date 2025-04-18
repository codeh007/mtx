"use client";
import type { UseMutationResult } from "@tanstack/react-query";
import type { SchemaForm } from "mtmaiapi";
import {
  type PropsWithChildren,
  type ReactElement,
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
} from "react";
import type { FieldValues } from "react-hook-form";
import { type StateCreator, createStore, useStore } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";
import { Dialog, DialogContent, DialogTitle } from "../../ui/dialog";
import { type UseZodForm, ZForm, ZFormToolbar } from "./ZodForm";

type MtxFormProps = {};

export interface PopupFormState extends MtxFormProps {
  formSchema?: SchemaForm;
  setFormSchema: (formSchema: SchemaForm) => void;
  setIsOpen: (isOpen: boolean) => void;
  layout?: "card" | "modal";
  isOpen?: boolean;
  submitHandler?: (values: unknown) => void;
  setSubmitHandler: (submitHandler: (values: unknown) => void) => void;
  defaultValues?: unknown;
  setDefaultValues: (defaultValues: unknown) => void;

  //初始数据（通常对应listitem, 根据这个数据，如果需要再通过api 获取详细数据以获取 Detail 数据）
  initData?: unknown;
  setInitData: (initData: unknown) => void;
  loadDetailProceduce?: string;
  setLoadDetailProceduce: (loadDetailProceduce: string) => void;
  loadDetailParams?: unknown;
  setLoadDetailParams: (loadDetailParams: unknown) => void;

  //新
  formComponent?: ReactNode;
  setFormComponent: (formComponent: ReactNode) => void;
}

export const createFormSlice: StateCreator<
  PopupFormState,
  [],
  [],
  PopupFormState
> = (set, get) => ({
  formKey: "",
  setIsOpen: (isOpen) => set({ isOpen }),
  setFormSchema: (formSchema) => set({ formSchema }),
  setSubmitHandler: (submitHandler) => set({ submitHandler }),
  setDefaultValues: (defaultValues) => set({ defaultValues }),
  setInitData: (initData) => set({ initData }),
  setLoadDetailProceduce: (loadDetailProceduce) => set({ loadDetailProceduce }),
  setLoadDetailParams: (loadDetailParams) => set({ loadDetailParams }),
  setFormComponent: (formComponent) => set({ formComponent }),
});

const createFormStore = (initProps?: Partial<MtxFormProps>) => {
  return createStore<PopupFormState>()(
    devtools(
      immer((...a) => ({
        ...createFormSlice(...a),
        ...initProps,
      })),
      {
        name: "mtxForm",
      },
    ),
  );
};
type formStore = ReturnType<typeof createFormStore>;
const formContext = createContext<formStore | null>(null);

/** *************************************************************
 * 弹出式表单渲染
 * @param props
 * @returns
 ****************************************************************/
export const PopupFormProvider = (props: PropsWithChildren<MtxFormProps>) => {
  const { children, ...etc } = props;
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const mystore = useMemo(() => createFormStore(etc), [etc]);
  return (
    <formContext.Provider value={mystore}>
      {children}
      <FormViewLayoutDlg />
    </formContext.Provider>
  );
};

export const DEFAULT_USE_SHALLOW = true;

export function usePopupFormStore(): PopupFormState;
export function usePopupFormStore<T>(selector: (state: PopupFormState) => T): T;
export function usePopupFormStore<T>(selector?: (state: PopupFormState) => T) {
  const store = useContext(formContext);
  if (!store) throw new Error("useToast must in ToastProvider");
  if (selector) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useStore(
      store,
      // eslint-disable-next-line react-hooks/rules-of-hooks
      DEFAULT_USE_SHALLOW ? useShallow(selector) : selector,
    );
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useStore(store);
}

export const usePopupFormV2 = (props: { component: ReactElement }) => {
  const setIsOpen = usePopupFormStore((x) => x.setIsOpen);
  const setFormComponent = usePopupFormStore((x) => x.setFormComponent);

  const show = useCallback(() => {
    console.log("open show form v2", props.component);
    setFormComponent(props.component);
    setIsOpen(true);
  }, [props.component, setFormComponent, setIsOpen]);
  const close = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);
  return {
    show,
    close,
  };
};

export default function FormViewLayoutDlg() {
  const isOpen = usePopupFormStore((x) => x.isOpen);
  const setIsOpen = usePopupFormStore((x) => x.setIsOpen);
  const formSchema = usePopupFormStore((x) => x.formSchema);
  return (
    <>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="space-y-2">
            <DialogTitle>{formSchema?.title}</DialogTitle>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export function PopupDashForm<TInput extends FieldValues>(
  props: Omit<React.ComponentProps<"form">, "onSubmit" | "id"> & {
    // handleSubmit: SubmitHandler<TInput>;
    form: UseZodForm<TInput>;
    mutation: UseMutationResult<any, any, any, any>;
    disableSubmitBar?: boolean;
  },

  // & Omit<ComponentProps<typeof ZForm>, "handleSubmit">
  // &
  //   PropsWithChildren,
) {
  const { mutation, children, disableSubmitBar, ...etc } = props;
  const handleSubmit = (values) => {
    mutation.mutateAsync(values);
  };
  return (
    <>
      <ZForm {...etc} handleSubmit={handleSubmit}>
        {children}

        {!disableSubmitBar && (
          <ZFormToolbar
            form={etc.form}
            className="bg-primary-500 border p-2 font-bold text-white"
          />
        )}
      </ZForm>
    </>
  );
}
