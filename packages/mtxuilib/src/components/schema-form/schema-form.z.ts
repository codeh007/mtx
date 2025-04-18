import { z } from "zod";

export const schemaFieldValueType = z.enum(["string", "number", "date", "email"]);

export const schemaField = z.object({
  name: z.string(),
  label: z.string().optional(),
  type: z.string().optional(),
  valueType: schemaFieldValueType.optional(),
  defaultValue: z.any().optional(),
  placeholder: z.string().optional(),
  description: z.string().optional(),
});
export const schemaFormSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  action: z.string().optional(),
  fields: schemaField.array(),

  //试验
  loadingDetailDataProcedure: z.string().optional(),
  loadingDetailDataParams: z.any().optional(),
});

export type SchemaForm = z.infer<typeof schemaFormSchema>;
