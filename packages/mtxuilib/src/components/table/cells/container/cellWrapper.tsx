'use client'

import { ReactNode } from "react"

interface CellWrapperProps {
  children: ReactNode
}
export const CellWrapper = ({ children }: CellWrapperProps) => {
  return (<div>
    {children}
  </div>)
}
