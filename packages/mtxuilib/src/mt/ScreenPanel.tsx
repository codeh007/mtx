"use client";
import {
  type ComponentProps,
  type PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "../lib/utils";
import { Button } from "../ui/button";
import type { Dialog } from "../ui/dialog";

export interface ScreenPanelProps extends ComponentProps<typeof Dialog> {
  className?: string;
  // isShowClose?: boolean;
}
export const ScreenPanel = (props: PropsWithChildren<ScreenPanelProps>) => {
  const { className, children, onOpenChange } = props;
  const scrollRef = useRef(null);

  const [open, setOpen] = useState(
    props.open === undefined ? true : props.open,
  );

  useEffect(() => {
    // 原因： fiexed 定位，在 文档流中依然会保留位置，导致可能出现滚动条。
    //       这里强制隐藏滚动条。
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : originalOverflow;
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);
  if (!open) {
    return null;
  }

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className={cn(
          "fixed left-0 top-0 z-30 mx-auto max-h-full min-h-full w-full overflow-auto ",
          "bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur",
          className,
        )}
      >
        {onOpenChange && (
          <div className="flex justify-end gap-2">
            <Button
              variant={"ghost"}
              onClick={() => {
                onOpenChange(false);
              }}
            >
              X
            </Button>
          </div>
        )}

        {children}
      </div>
    </div>
  );
};
