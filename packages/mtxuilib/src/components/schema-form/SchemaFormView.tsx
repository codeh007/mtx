"use client";

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { EditFormToolbar } from "../../form/EditFormToolbar";
import type { MaybePromise } from "../../types/common";
import { Card, CardContent } from "../../ui/card";
import { DialogFooter } from "../../ui/dialog";
import { SchemaFormFieldsRender } from "./SchemaFormFieldsRender";
import type { SchemaForm } from "./schema-form.z";

type SchemaFormViewVaranit = "auto" | "modal" | "card";

export const SchemaFormView = (props: {
  formSchema?: SchemaForm;
  defaultValues?: any;
  onSubmit: (values: any) => MaybePromise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  variants?: SchemaFormViewVaranit;
}) => {
  const { formSchema, onSubmit, onCancel, variants } = props;
  const [defaultValues, setDefaultValues] = useState<any>({});
  const form = useForm({
    defaultValues: defaultValues,
  });

  if (!formSchema) {
    return <div className="border p-8">missing formSchema params</div>;
  }
  return (
    <>
      <FormProvider {...form}>
        <Card className="p-2">
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <SchemaFormFieldsRender schema={formSchema} />
              <DialogFooter>
                <EditFormToolbar onCancel={() => onCancel?.()} />
              </DialogFooter>
            </form>
          </CardContent>
        </Card>
      </FormProvider>
    </>
  );
};
