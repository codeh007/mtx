"use client";

import { CellContext } from "@tanstack/react-table";
import React from "react";
import { CellWrapper } from "./container/cellWrapper";

export const StringCell = (info: CellContext<any, any>) => {
  const initialValue = info.cell.getValue();
  const [value, setValue] = React.useState(initialValue);
  //输入框失去焦点后，调用后端更新数据。
  const onBlur = () => {
    console.log("更新单元格", info.row.index, info.column.id, value);
    // info.table.options.meta?.updateData(info.row.index, info.column.id, value)
  };
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  return (
    <CellWrapper>
      {value}
      {/* <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-10 rounded-full p-0">
                        <Settings2 className="h-4 w-4" />
                        <span className="sr-only">Open popover</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium leading-none">Dimensions</h4>
                            <p className="text-sm text-muted-foreground">
                                Set the dimensions for the layer.
                            </p>
                        </div>
                        <div className="grid gap-2">
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="width">Width</Label>
                                <Input
                                    id="width"
                                    defaultValue="100%"
                                    className="col-span-2 h-8"
                                />
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="maxWidth">Max. width</Label>
                                <Input
                                    id="maxWidth"
                                    defaultValue="300px"
                                    className="col-span-2 h-8"
                                />
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="height">Height</Label>
                                <Input
                                    id="height"
                                    defaultValue="25px"
                                    className="col-span-2 h-8"
                                />
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="maxHeight">Max. height</Label>
                                <Input
                                    id="maxHeight"
                                    defaultValue="none"
                                    className="col-span-2 h-8"
                                />
                            </div>
                        </div>
                    </div>
                </PopoverContent>
            </Popover> */}
    </CellWrapper>
  );
};
