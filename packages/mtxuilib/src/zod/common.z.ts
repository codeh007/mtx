import { z } from "zod";
//数字字符串
export const numStringSchema = z
  .custom<number | string>()
  .refine((value) => value ?? false, "Required")
  .refine((value) => Number.isFinite(Number(value)), "Invalid number")
  .transform((value) => Number(value));

export type NumString = z.infer<typeof numStringSchema>;

//通用 json 数据
export type Literal = boolean | number | string;
export type Json = Literal | { [key: string]: Json } | Json[];
export const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
export const jsonSchema: z.ZodSchema<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]),
);

export const deleteByIdSchema = z.object({
  id: numStringSchema.optional(),
});

export const PaginateQuery = z.object({
  cursor: z.string().nullish().optional(),
  limit: z.number().min(1).max(1000).optional(),
});

export const curdViewTypeSchema = z
  .enum(["simple", "table", "card", "grid"])
  .default("simple");
export type CurdViewType = z.infer<typeof curdViewTypeSchema>;

export const mutationCreateOutSchema = z.object({
  code: z.string().optional(),
  description: z.string().optional(),
  message: z.string().optional(),
});

/*eslint sort-keys: "error"*/
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "test", "production"]),
});

export const env = envSchema.safeParse(process.env);

//提示：通过这个方式可以让程序必须正确对应的环境变量才能正确启动。

// if (!env.success) {
//   console.error(
//     '❌ Invalid environment variables:',
//     JSON.stringify(env.error.format(), null, 4),
//   );
//   process.exit(1);
// }

export const commonDeleteInput = z.object({
  id: z.string().or(z.number()),
});

export const ogImageSchema = z.object({
  heading: z.string(),
  type: z.string(),
  mode: z.enum(["light", "dark"]).default("dark"),
  bountyPrice: z.string(),
});
