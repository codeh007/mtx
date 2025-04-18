import type { Column, ColumnDef, Row, Table } from "@tanstack/react-table";

export interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}
export interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}
export interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}
