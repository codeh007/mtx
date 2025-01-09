"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import type { SchemaForm } from "./schema-form.z";

export const SchemaFormFieldsRender = (props: {
  schema: SchemaForm;
}) => {
  const { schema } = props;
  const form = useFormContext();
  return (
    <>
      {schema.fields?.map((formField, i) => {
        return (
          <FormField
            key={i}
            control={form.control}
            name={formField.name}
            defaultValue={formField.defaultValue || ""}
            render={({ field }) => (
              <FormItem>
                {formField.label && <FormLabel>{formField.label}</FormLabel>}
                <FormControl>
                  <>
                    <Input placeholder={formField.placeholder} {...field} />
                  </>
                </FormControl>
                {formField.description && (
                  <FormDescription>{formField.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );
      })}
    </>
  );
};
