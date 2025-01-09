"use client";
import type React from "react";
import { type PropsWithChildren, forwardRef, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "../lib/utils";
import { Button } from "../ui/button";
import type { AnyZodForm } from "./ZodForm";
import { ConformDeleteBtn } from "./deleteConform";

/**
 * 跟zod form 结合使用，这里关注点是表单的提交和取消
 * 提示： 传入 form 对象，可以将组件放到 <form />元素之外。(自动根据form.id值提交form)
 */
export const EditFormToolbar = forwardRef<
  HTMLDivElement,
  {
    onCancel?: () => void;
    /**
     * Optionally specify a form to submit instead of the closest form context.
     */
    form?: AnyZodForm;
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
    onSubmit,
    onCancel,
    children,
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
EditFormToolbar.displayName = "EditFormToolbar";

const ComformCancel = (props: {
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
