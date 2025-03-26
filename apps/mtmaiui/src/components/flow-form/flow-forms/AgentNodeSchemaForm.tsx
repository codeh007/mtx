"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
// import { agentNodeFormOptions } from "mtmaiapi";

import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { ZForm, ZFormToolbar, useZodForm } from "mtxuilib/mt/form/ZodForm";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { useTenant } from "../../../hooks/useAuth";

interface SchemaFormViewProps {
  schema: any;
  onSubmit: (values) => void;
}
export const AgentNodeSchemaForm = ({
  schema,
  onSubmit,
}: SchemaFormViewProps) => {
  const tenant = useTenant();
  const schemaFormQuery = useSuspenseQuery({
    ...agentNodeFormOptions({
      path: {
        node: schema,
        tenant: tenant!.metadata.id,
      },
    }),
  });
  const form = useZodForm({
    // schema: schemaFormQuery.data,
    // onSubmit: onSubmit,
  });
  return (
    <>
      <DebugValue
        data={{
          data: schemaFormQuery.data,
        }}
      />
      <ZForm form={form} handleSubmit={onSubmit}>
        {schemaFormQuery.data.form.title && (
          <div>{schemaFormQuery.data.form.title}</div>
        )}

        {schemaFormQuery.data.form.fields.map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{field.name}</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                {/* <FormDescription></FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <ZFormToolbar form={form} />
      </ZForm>
    </>
  );
};
