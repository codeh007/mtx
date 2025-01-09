import { z } from "zod";


export type TRPCMeta = Record<string, unknown>;
export type Meta<TMeta = TRPCMeta> = TMeta & {
  authRequired?: boolean;
  role?: 'user' | 'admin';
  curdTitle?: string;
  curdView?: z.infer<typeof curdViewSchema>
  listView?: z.infer<typeof metaListViewSchema>
};


export const metaListViewSchema = z.object({
  viewType: z.enum(["default", "grid", "table"]).default("default").optional(),
  titleFormat: z.string().optional(),
  listPaginateType: z.enum(["default", "infinite"]).default("infinite").optional(),
  listDefaultPageSize: z.number().default(24).optional(),
  initQueryParams: z.any().optional().optional(),
})

const curdViewSchema = z.object({
  viewHome: z.string().default("/dash/:svc"),
  viewLayout: z.enum(["default", "mail", "table"]).default("mail"),
  routeShow: z.string().default("/dash/:svc/:id"),
  routeEdit: z.string().default("/dash/:svc/:edit"),
  routeDelete: z.string().default("/dash/:svc/remove"),
  routeList: z.string().default("/dash/:svc"),
})
