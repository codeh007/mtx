"use client";

import type { PropsWithChildren } from "react";
import { cn } from "../../lib/utils";

export type SkeletonLayoutProps = {
  // 绝对满屏，增加占位符满屏，覆盖元素，通常用于后台首页组件加载中的页面
  forceFullScreen?: boolean;
  // 附加样式
  className?: string;
  // 附加的文字描述
  text?: string;
};

/**
 * 通常用于布局组件的加载占位
 */
export const SkeletonLayout = ({
  forceFullScreen,
  className,
  text,
  children,
}: PropsWithChildren<SkeletonLayoutProps>) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center  p-8",
        forceFullScreen ? "fixed inset-0 z-50" : "min-h-screen",
        className,
      )}
    >
      <div className="relative">
        {children && (
          <div className="absolute inset-0 flex items-center justify-center">
            {children}
          </div>
        )}
      </div>
      {text && <div className="mt-4 text-center text-gray-700">{text}</div>}
    </div>
  );
};
