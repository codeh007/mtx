import type { HeaderContext } from "@tanstack/react-table";
import { Checkbox } from "../../../ui/checkbox";
import type { TableViewColumn } from "../table.z";
import { SimpleHeaderRender } from "./SimpleHeader";

export const TableHeader = (
  props: {
    columnConfig: TableViewColumn;
  } & HeaderContext<Record<string, unknown>, unknown>,
) => {
  const { table, column, columnConfig } = props;
  if (!columnConfig.header) {
    return <div />;
  }
  const headerType = columnConfig.header.type;
  switch (headerType) {
    case "checkbox":
      return (
        <Checkbox
          //@ts-ignore
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      );
    default:
      return (
        <SimpleHeaderRender column={column} title={columnConfig.header.label} />
      );
  }
};
