'use client'

import { CellContext } from "@tanstack/react-table";
import Link from "next/link";
import React from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select";
/**
 * 连接到关联的资源视图
 * @param info
 * @returns
 */
export const ViewLinkCell = (info: CellContext<any, any>) => {
  const [value, setValue] = React.useState(info.cell.getValue())
  //输入框失去焦点后，调用后端更新数据。
  const onBlur = () => {
    const numValue = parseInt(value)
    // info.table.options.meta?.updateData(info.row.index, info.column.id, numValue)
  }
  return <>
    <Link href={"#"}>res link</Link>
  </>
}


interface SelectCellItem {
  label: string,
  value: string,
}
interface NewSelectCellOptions {
  placeholder?: string
  items: SelectCellItem[]
}
export const NewSelectCell = ({ placeholder, items }: NewSelectCellOptions) => {
  // eslint-disable-next-line react/display-name
  return (info: CellContext<any, any>) => {
    return <>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={placeholder || "--"} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {/* <SelectLabel>Fruits</SelectLabel> */}
            {
              items?.map((item, i) => {
                return <SelectItem value={item.value} key={i}>{item.label}</SelectItem>
              })
            }
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  }
}
