import { z } from "zod";

/**
 * 用 zod schema 表达树类型例子
 */
const treeNodeBaseSchema = z.object({
  id: z.string(),
  pid: z.string().optional(),
  label: z.string().optional(),
  icon: z.string().optional(),
});

export type TreeNode = z.infer<typeof treeNodeBaseSchema> & {
  children: TreeNode[];
};
//@ts-ignore
export const treeNodeSchema: z.ZodType<TreeNode> = treeNodeBaseSchema.extend({
  children: z.lazy(() => treeNodeSchema.array()),
});

export type TreeItemType = z.infer<typeof treeNodeSchema>;
