'use client'

import { CellContext } from "@tanstack/react-table";
import { ChevronRight } from 'lucide-react';
import { cn } from "../../../lib/utils";


export const ExpenderCell = (info: CellContext<any, any>) => {
  return info.row.getCanExpand() ? (
    <button className="pointer"
      {...{
        onClick: info.row.getToggleExpandedHandler(),
      }}
    >
      <ChevronRight className={cn(info.row.getIsExpanded() && "rotate-90")}></ChevronRight>
    </button>
  ) : (
    '🔵'
  )
}
