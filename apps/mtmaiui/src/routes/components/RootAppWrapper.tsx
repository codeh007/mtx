"use client";

import type { PropsWithChildren } from "react";

export function RootAppWrapper({ children }: PropsWithChildren) {
  return (
    <div className="fixed flex flex-1 top-0 left-0 w-full h-full z-50 bg-blue-300 p-2">{children}</div>
  );
}
