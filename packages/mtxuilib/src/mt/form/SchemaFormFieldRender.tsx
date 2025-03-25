"use client";

import type { SchemaForm } from "mtmaiapi";
import { Fragment, useMemo } from "react";
import { z } from "zod";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { ZForm, ZFormToolbar, useZodForm } from "./ZodForm";

export const SchemaFormFieldRender = (props: {
  formSchema: SchemaForm;
  onSubmit: (values: unknown) => void;
  defaultValues?: unknown;
}) => {
  const { formSchema, onSubmit, defaultValues } = props;
  const form = useZodForm({
    schema: z.any(),
    defaultValues: defaultValues,
  });

  useMemo(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);
  return (
    <>
      <ZForm
        form={form}
        className="space-y-2"
        handleSubmit={(v) => {
          onSubmit(v);
        }}
      >
        {formSchema.fields.map((field, i) => {
          const fieldType = field.type;
          const key = i;
          switch (fieldType) {
            default:
              return (
                <Fragment key={key}>
                  <FormField
                    control={form.control}
                    name={field.name}
                    render={({ field: formField }) => (
                      <FormItem>
                        {field.label && <FormLabel>{field.label}</FormLabel>}
                        <FormControl>
                          <Input
                            placeholder={field.placeholder}
                            {...formField}
                          />
                        </FormControl>
                        {field.description && (
                          <FormDescription>{field.description}</FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Fragment>
              );
          }
        })}

        <ZFormToolbar
          form={form}
          className="bg-primary-500 border p-2 font-bold text-white"
        />
      </ZForm>
    </>
  );
};
