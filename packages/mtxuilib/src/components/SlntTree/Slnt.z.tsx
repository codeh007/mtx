import { z } from "zod";
const DashMenuTreeItemRouteType = ["default", "list", "detail"] as const;

const slntTreeNodeBaseSchema = z.object({
  id: z.string(),
  pid: z.string().optional(),
  label: z.string().optional(),
  icon: z.string().optional(),
  routeName: z.string().optional(),
  routeType: z.enum(DashMenuTreeItemRouteType).optional(),
});

export type DashMenuTreeItem = z.infer<typeof slntTreeNodeBaseSchema> & {
  children?: DashMenuTreeItem[];
};
export const treeNodeSchema: z.ZodType<DashMenuTreeItem> =
  slntTreeNodeBaseSchema.extend({
    children: z.lazy(() => treeNodeSchema.array()).optional(),
  });
