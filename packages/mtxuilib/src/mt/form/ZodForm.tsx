"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import {
  type FieldValues,
  FormProvider,
  type SubmitHandler,
  type UseFormProps,
  type UseFormReturn,
  useForm,
} from "react-hook-form";
import { z } from "zod";

/**
 * 实现 react hook form + trpc + 前后端共用 zod schema
 * 参考： https://kitchen-sink.trpc.io/react-hook-form?file=#content
 */
export type UseZodForm<TInput extends FieldValues> = UseFormReturn<TInput> & {
  /**
   * A unique ID for this form.
   */
  id: string;
};
export function useZodForm<TSchema extends z.ZodType>(
  props: Omit<UseFormProps<TSchema["_input"]>, "resolver"> & {
    schema?: TSchema;
  },
) {
  const _schema = props.schema || z.any();

  const a = zodResolver(_schema, undefined, {
    // This makes it so we can use `.transform()`s on the schema without same transform getting applied again when it reaches the server
    raw: true,
  });
  const form = useForm<TSchema["_input"]>({
    ...props,

    //@ts-ignore
    resolver: a,
  }) as UseZodForm<TSchema["_input"]>;

  form.id = useId();
  return form;
}

export type AnyZodForm = UseZodForm<any>;

export function ZForm<TInput extends FieldValues>(
  props: Omit<React.ComponentProps<"form">, "onSubmit" | "id"> & {
    handleSubmit: SubmitHandler<TInput>;
    form: UseZodForm<TInput>;
  },
) {
  const { handleSubmit, form, ...passThrough }: typeof props = props;

  return (
    <FormProvider {...form}>
      {/* 原版的写法，好像有点问题 */}
      {/* <form
        {...passThrough}
        id={form.id}
        onSubmit={(event) => {
          form.handleSubmit(async (values) => {
            try {
              await handleSubmit(values);
            } catch (cause) {
              form.setError("root.server", {
                message: (cause as Error)?.message ?? "Unknown error",
                type: "server",
              });
            }
          })(event);
        }}
      /> */}
      <form
        {...passThrough}
        id={form.id}
        onSubmit={form.handleSubmit(async (values) => {
          try {
            await handleSubmit(values);
          } catch (cause) {
            form.setError("root.server", {
              message: (cause as Error)?.message ?? "Unknown error",
              type: "server",
            });
          }
        })}
      />
    </FormProvider>
  );
}
