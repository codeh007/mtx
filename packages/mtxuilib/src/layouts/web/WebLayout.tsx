"use client";

import { WebLayoutHeader } from "./WebLayoutHeader";

export function WebLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WebLayoutHeader />
      {children}
    </>
  );
}
