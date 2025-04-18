'use client'

import { CellContext } from "@tanstack/react-table";
import React from "react";
export const NumberCell = (info: CellContext<any, any>) => {
  const [value, setValue] = React.useState(info.cell.getValue())
  //输入框失去焦点后，调用后端更新数据。
  const onBlur = () => {
    const numValue = parseInt(value)
    // info.table.options.meta?.updateData(info.row.index, info.column.id, numValue)
  }
  return <div className="flex w-full">
    <input type="number" value={value as string} onChange={e => setValue(e.target.value)} onBlur={onBlur} className="grow" />
  </div>
}
