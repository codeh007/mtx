"use client";
import Link from "next/link";
import { cn } from "../../lib/utils";
export const WebLayoutHeader = () => {
  return (
    <header
      className={cn(
        "bg-background sticky top-0 z-30 flex h-14 items-center gap-4 border-b px-4 pt-1 ",
        "sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6",
        "fixed top-0 left-0",
        "bg-slate-200",
      )}
      // className="sticky top-0 flex h-14 items-center gap-4 border-b px-4 pt-1 "
    >
      {/* 暂时去掉面包屑导航，应该感觉有点多余 */}
      {/* <DashBreadcrumb /> */}

      <div className="flex-1">
        <nav className="flex gap-4">
          <Link href="/">首页</Link>
          <Link href="/doc">文档</Link>
          <Link href="/ag#/chat">智能工作室</Link>
        </nav>
      </div>
    </header>
  );
};
