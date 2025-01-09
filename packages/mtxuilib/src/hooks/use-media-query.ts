'use client'

import { useEffect, useState } from "react"

export function useMediaQuery(query: string) {
  const [value, setValue] = useState(false)
  useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches)
    }
    const result = matchMedia(query)
    result.addEventListener("change", onChange)
    setValue(result.matches)

    return () => result.removeEventListener("change", onChange)
  }, [query])

  return value
}

export const useIsDesktop = () => {
  return useMediaQuery("(min-width: 768px)")
}

export const useIsTwBreakpointSm = () => {
  return useMediaQuery("(min-width: 640px)")
}
export const useIsTwBreakpointMd = () => {
  return useMediaQuery("(min-width: 768px)")
}
export const useIsTwBreakpointLg = () => {
  return useMediaQuery("(min-width: 1024px)")
}
export const useIsTwBreakpointXl = () => {
  return useMediaQuery("(min-width: 1280px)")
}
export const useIsTwBreakpoint2XL = () => {
  return useMediaQuery("(min-width: 1536px)")
}
