"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type PropsWithChildren,
  forwardRef,
  useId,
  useMemo,
  useState,
} from "react";
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  type SubmitHandler,
  type UseFormProps,
  type UseFormReturn,
  useForm,
  useFormContext,
} from "react-hook-form";
import { z } from "zod";
import { cn } from "../../lib/utils";
import { Button } from "../../ui/button";
import { Form, FormField } from "../../ui/form";
import { useToast } from "../../ui/use-toast";
import { ConformDeleteBtn } from "./deleteConform";

/**
 * 参考： https://kitchen-sink.trpc.io/react-hook-form?file=#content
 */
export type UseZodForm<TInput extends FieldValues> = UseFormReturn<TInput> & {
  id: string;
};
export function useZodForm<TSchema extends z.ZodType>(
  props: Omit<UseFormProps<TSchema["_input"]>, "resolver"> & {
    schema?: TSchema;
  },
) {
  const resolver = zodResolver(props.schema || z.any(), undefined, {
    raw: true,
  });
  const formId = useId();
  const form = useForm<TSchema["_input"]>({
    ...props,
    resolver: resolver,
  }) as UseZodForm<TSchema["_input"]>;

  form.id = formId;
  return form;
}

export function useZodFormV2<TSchema extends z.ZodType>(
  props: Omit<UseFormProps<TSchema["_input"]>, "resolver"> & {
    schema?: TSchema;
    handleSubmit: SubmitHandler<TSchema["_input"]>;
    toastValidateError?: boolean;
  },
) {
  const resolver = zodResolver(props.schema || z.any(), undefined, {
    raw: true,
  });
  const form = useForm<TSchema["_input"]>({
    ...props,
    resolver: resolver,
  }) as UseZodForm<TSchema["_input"]>;

  form.id = useId();
  return {
    form,
    handleSubmit: props.handleSubmit,
    toastValidateError: props.toastValidateError,
  };
}

export function ZForm<TInput extends FieldValues>(
  props: Omit<React.ComponentProps<"form">, "onSubmit" | "id"> & {
    handleSubmit: SubmitHandler<TInput>;
    form: UseZodForm<TInput>;
    toastValidateError?: boolean;
  } & PropsWithChildren,
) {
  const { handleSubmit, form, children, ...passThrough }: typeof props = props;

  const formErrors = Object.keys(form.formState.errors);
  const toast = useToast();
  const handleSubmitInner = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formErrors.length) {
      if (props.toastValidateError) {
        toast.toast({
          title: "表单不正确",
          description: formErrors.join(","),
        });
      }
      return;
    }
    form.handleSubmit(handleSubmit)(e);
  };
  return (
    <Form {...form}>
      <form {...passThrough} id={form.id} onSubmit={handleSubmitInner}>
        {children}
      </form>
    </Form>
  );
}

/**
 * 跟zod form 结合使用，这里关注点是表单的提交和取消
 * 提示： 传入 form 对象，可以将组件放到 <form />元素之外。(自动根据form.id值提交form)
 */
export const ZFormToolbar = forwardRef<
  HTMLDivElement,
  {
    onCancel?: () => void;
    /**
     * Optionally specify a form to submit instead of the closest form context.
     */
    form?: UseZodForm<any>;
    submitText?: string;
    enableCancelConform?: boolean;
    enableDeleteButton?: boolean;
    onDelete?: () => void;
    //如果指定，则跳过默认的onSubmit行为，一般用于自定义的表单提交行为。如果没有指定onSubmit，则自动触发当前form 的onSumit
    onSubmit?: (values) => void;
  } & PropsWithChildren &
    React.HTMLAttributes<HTMLDivElement>
>((props, forwardedRef) => {
  const {
    submitText,
    onCancel,
    enableCancelConform,
    enableDeleteButton,
    onDelete,
  } = props;
  const [openConform, setOpenConform] = useState(false);
  const context = useFormContext();

  const form = props.form ?? context;
  const { formState } = form;

  useMemo(() => {
    if (form.formState.errors && Object.keys(form.formState.errors).length) {
      console.log("表单不正确", {
        errors: form.formState.errors,
        values: form.getValues(),
      });
    }
  }, [form]);

  if (!form) {
    throw new Error(
      "SubmitButton must be used within a Form or have a form prop",
    );
  }
  return (
    <div className="flex w-full flex-col  p-1">
      {!openConform && (
        <div className="flex justify-end gap-2">
          <Button
            variant={"outline"}
            className=" min-w-24"
            onClick={(e) => {
              e.preventDefault();
              if (enableCancelConform && form?.formState?.isDirty) {
                setOpenConform(true);
              } else {
                onCancel?.();
              }
            }}
          >
            取消
          </Button>
          <Button
            form={props.form?.id}
            type="submit"
            disabled={formState.isSubmitting}
            className="min-w-24"
          >
            {formState.isSubmitting ? "Loading" : submitText || "确定"}
          </Button>

          {enableDeleteButton && (
            <ConformDeleteBtn
              callback={async () => {
                onDelete?.();
              }}
              disabled={form.formState.isSubmitting}
              variant={"destructive"}
            >
              删除
            </ConformDeleteBtn>
          )}
        </div>
      )}
      {openConform && (
        <ComformCancel
          onBack={() => {
            setOpenConform(false);
          }}
          onContinue={() => {
            onCancel?.();
          }}
        />
      )}
    </div>
  );
});

export const ComformCancel = (props: {
  onContinue: () => void;
  onBack: () => void;
}) => {
  const { onContinue, onBack } = props;
  return (
    <div className="flex gap-2">
      未保存更改，确定继续吗？
      <Button
        onClick={(e) => {
          e.preventDefault();
          onBack();
        }}
      >
        继续编辑
      </Button>
      <Button
        variant={"destructive"}
        className={cn("")}
        onClick={(e) => {
          e.preventDefault();
          onContinue();
        }}
      >
        关闭
      </Button>
    </div>
  );
};
export const ZFormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormField {...props}>
      <Controller {...props} />
    </FormField>
  );
};
