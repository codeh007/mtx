"use client";
import { useRouterState } from "@tanstack/react-router";
import { cn } from "mtxuilib/lib/utils";
import { Separator } from "mtxuilib/ui/separator";
import { SidebarToggle } from "./sidebar/sidebar-toggle";

interface DashHeadersProps {
  borderBottom?: boolean;
  children?: React.ReactNode;
  className?: string;
}
export const DashHeaders = (props: DashHeadersProps) => {
  const matches = useRouterState({ select: (s) => s.matches });
  const breadcrumbs = matches
    .filter((match) => match.context.getTitle)
    .map(({ pathname, context }) => {
      return {
        title: context.getTitle(),
        path: pathname,
      };
    });
  return (
    <header
      className={cn(
        "sticky top-0 flex flex-row shrink-0 items-center gap-2 bg-background px-4 py-2",
        {
          // TODO: 默认没下划线，滚动后有下划线
          // "border-b": props.borderBottom,
        },
        props.className,
      )}
    >
      <SidebarToggle className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-2" />
      {props.children}
    </header>
  );
};

interface HeaderActionConainerProps {
  className?: string;
}
export const HeaderActionConainer = (
  props: HeaderActionConainerProps & { children: React.ReactNode },
) => {
  return (
    <div className={cn("flex flex-1 gap-2 justify-end", props.className)}>
      {props.children}
    </div>
  );
};
