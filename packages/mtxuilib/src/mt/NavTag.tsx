"use client";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import {
  usePathname,
  useSelectedLayoutSegment,
  useSelectedLayoutSegments,
} from "next/navigation";
import type { PropsWithChildren } from "react";
import { useGo } from "../hooks/use-router";
import { urlJoinPaths } from "../http/url";
import { cn } from "../lib/utils";
import { Button } from "../ui/button";

interface NavTabsProps {
  enableGobackBtn?: boolean;
  items: {
    href: string;
    routeName: string;
    label: string;
  }[];
}
export const NavTabs = ({ items, enableGobackBtn }: NavTabsProps) => {
  const segment = useSelectedLayoutSegment();
  const segments = useSelectedLayoutSegments();
  const pathname = usePathname();
  // const seg = useSelectedLayoutSegment();
  const segPath = segments.join("/");
  const basePath = segPath ? pathname.slice(0, -segPath.length - 1) : pathname;
  const go = useGo();
  return (
    <div className="flex">
      {/* <DebugValue
				data={{
					items,
					segment,
					// segments,
					pathname,
					basePath,
					// segmentsPaths,
					// layoutBasePath,
				}}
			/> */}
      {enableGobackBtn && (
        <Button
          variant={"ghost"}
          onClick={() => {
            go.goParent();
          }}
        >
          <ChevronLeft className="mr-2 size-4" />
        </Button>
      )}
      {items?.map((item, i) => {
        const href = `${urlJoinPaths(basePath, item.routeName)}`;
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <TabItem key={i} activate={(segment || "") === item.routeName}>
            <Link href={href}>{item.label}</Link>
          </TabItem>
        );
      })}
    </div>
  );
};
const TabItem = (
  props: {
    activate?: boolean;
  } & PropsWithChildren,
) => {
  const { activate, ...etc } = props;
  return (
    <div
      data-state={activate && "active"}
      className={cn(
        " focus-visible:ring-ring  inline-flex items-center justify-center whitespace-nowrap  transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        "border-red-400",
        "data-[state=active]:border-b-2",
        "data-[state=active]:font-bold",
        "data-[state=active]:border-black",
        "hover:bg-slate-300",
        "px-3 py-1",
      )}
      {...etc}
    />
  );
};
