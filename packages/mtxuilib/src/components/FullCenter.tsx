"use client";

import type { PropsWithChildren } from "react";

/**
 * 让内容满高满宽， 垂直和横向都居中
 * @returns
 */
export const FullCenter = (props: PropsWithChildren) => {
  const { children } = props;
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex-1">{children}</div>
    </div>
  );
};
