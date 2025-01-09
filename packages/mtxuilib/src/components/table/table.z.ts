import * as z from "zod";

//练习1===========================================
const Id1 = z.object({
  id: z.string().optional(),
  accessorKey: z.string(),
});

const Id2 = z.object({
  id: z.string(),
  accessorKey: z.string().optional(),
});

const tableViewColumnIdField = z.intersection(Id1, Id2);

type dddd = z.infer<typeof tableViewColumnIdField>;
//练习1 结束===========================================

export const tableHeader = z.object({
  type: z.string().optional(),
  label: z.string(),
});

export type TableHeaderConfig = z.infer<typeof tableHeader>;

export const tableCell = z.object({
  type: z.string().optional(),
  props: z.any().optional()
});

export type tableCell = z.infer<typeof tableCell>;

export const tableViewColumns = z
  .object({
    id: z.string().optional(),
    accessorKey: z.string().optional(),
    label: z.string(),
    cell: tableCell.optional(),
    header: tableHeader.optional(),
    enableSorting: z.boolean().default(true).optional(),
    enableHiding: z.boolean().default(true).optional(),
  })

export type TableViewColumn = z.infer<typeof tableViewColumns>;

export const tableViewPaginate = z.object({
  enabled: z.boolean().optional(),
  //TODO: 完善 tableViewPaginate
});

export const tableViewConfig = z.object({
  columns: tableViewColumns.array(),
  paginate: tableViewPaginate,
});

export type TableViewConfig = z.infer<typeof tableViewConfig>;
