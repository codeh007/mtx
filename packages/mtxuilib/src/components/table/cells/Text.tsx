/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/display-name */
'use client'

import { CellContext } from "@tanstack/react-table";
import React from "react";

interface NewTextCellOptions {
  popup?: boolean,
  enableEdit?: boolean,
  placeholder?: string,
}
export const NewTextCell = ({ enableEdit, placeholder, popup }: NewTextCellOptions) => (info: CellContext<any, any>) => {
  const initialValue = info.cell.getValue()
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])
  //输入框失去焦点后，调用后端更新数据。
  const onBlur = () => {
    // console.log("更新单元格", info.row.index, info.column.id, value)
    // info.table.options.meta?.updateData(info.row.index, info.column.id, value)
  }
  return <>
    {/* <Textarea placeholder={placeholder} value={value}></Textarea> */}
    {value}
  </>
}
