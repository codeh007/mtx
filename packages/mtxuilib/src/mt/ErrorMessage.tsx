"use client";

import type { PropsWithChildren } from "react";

export const ErrorMessage = (props: PropsWithChildren) => {
  const { children } = props;
  return (
    <div className="mx-auto flex min-h-24 flex-col p-8">
      <div className="flex-1">{children}</div>
    </div>
  );
};
