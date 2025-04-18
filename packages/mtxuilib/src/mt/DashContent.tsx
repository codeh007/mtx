"use client";

import { useRouterState } from "@tanstack/react-router";
import { MtErrorBoundary } from "mtxuilib/components/MtErrorBoundary";
import { SkeletonListview } from "mtxuilib/components/skeletons/SkeletonListView";
import { cn } from "mtxuilib/lib/utils";
import { Separator } from "mtxuilib/ui/separator";
import { type PropsWithChildren, Suspense } from "react";
import { SidebarToggle } from "./sidebar-toggle";
export const DashContent = (props: PropsWithChildren) => {
  return (
    <div className="flex flex-1 flex-col">
      <Suspense fallback={<SkeletonListview />}>
        <MtErrorBoundary>{props.children}</MtErrorBoundary>
      </Suspense>
    </div>
  );
};

interface DashHeadersProps {
  borderBottom?: boolean;
  children?: React.ReactNode;
  className?: string;
}
export const DashHeaders = (props: DashHeadersProps) => {
  const matches = useRouterState({ select: (s) => s.matches });
  // const breadcrumbs = matches
  //   .filter((match) => match.context.getTitle)
  //   .map(({ pathname, context }) => {
  //     return {
  //       title: context.getTitle(),
  //       path: pathname,
  //     };
  //   });
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

// interface RootAppWrapperProps extends PropsWithChildren {
//   secondSidebar?: React.ReactNode;
//   className?: string;
// }
// export function RootAppWrapper({
//   children,
//   className,
//   secondSidebar,
// }: RootAppWrapperProps) {
//   return (
//     <SidebarProvider
//       className="min-h-none"
//       style={
//         {
//           "--sidebar-width": "350px", //如果需要左侧双侧边栏 就设置为 350px
//         } as React.CSSProperties
//       }
//     >
//       <div
//         className={cn(
//           "fixed flex flex-1 top-0 left-0 w-full h-full z-30",
//           className,
//         )}
//       >
//         <DashSidebar secondSidebar={secondSidebar} />
//         <SidebarInset>
//           <MtSuspenseBoundary>{children}</MtSuspenseBoundary>
//         </SidebarInset>
//       </div>
//     </SidebarProvider>
//   );
// }
