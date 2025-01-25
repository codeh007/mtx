"use client";

import type { PropsWithChildren } from "react";

export function RootAppWrapper({ children }: PropsWithChildren) {
  return (
    <div className="fixed flex top-0 left-0 w-full h-full">{children}</div>
  );
}
