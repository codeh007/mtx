"use client";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { ChevronsDown } from "lucide-react";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "../lib/utils";
import { Button } from "../ui/button";

interface MtScrollAreaProps
  extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
  showScrollButton?: boolean;
  autoScrollToBottom?: boolean;
  scrollToBottom?: () => void; // 这个是给外层用的，如果外层有滚动需求，可以传入这个函数
}

/**
 * 在 shadcn 的 scrollarea 基础上，增加了自动滚动到底部的功能
 */
export const MtScrollArea = forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  MtScrollAreaProps
>(
  (
    {
      className,
      children,
      autoScrollToBottom = false,
      showScrollButton: propShowScrollButton,
      ...props
    },
    ref,
  ) => {
    const [showScrollButton, setShowScrollButton] =
      useState(propShowScrollButton);
    const viewportRef = useRef<HTMLDivElement>(null);

    const handleScroll = useCallback(() => {
      if (viewportRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = viewportRef.current;
        const bottomThreshold = 100;
        setShowScrollButton(
          scrollHeight - scrollTop - clientHeight > bottomThreshold,
        );
      }
    }, []);

    const scrollToBottom = React.useCallback(() => {
      if (viewportRef.current) {
        viewportRef.current.scrollTo({
          top: viewportRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, []);

    useEffect(() => {
      const viewport = viewportRef.current;
      if (viewport) {
        viewport.addEventListener("scroll", handleScroll);
        return () => viewport.removeEventListener("scroll", handleScroll);
      }
    }, [handleScroll]);

    const contentRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      //自动滚动到下方
      //原理: 使用额外的div 包裹 children，当div的高度被改变了就触发滚动到底部的函数
      if (autoScrollToBottom && contentRef.current) {
        const resizeObserver = new ResizeObserver(() => {
          scrollToBottom();
        });

        resizeObserver.observe(contentRef.current);

        return () => {
          resizeObserver.disconnect();
        };
      }
    }, [autoScrollToBottom, scrollToBottom]);

    return (
      <ScrollAreaPrimitive.Root
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        {...props}
      >
        <ScrollAreaPrimitive.Viewport
          ref={viewportRef}
          className="size-full rounded-[inherit]"
        >
          <div ref={contentRef}>{children}</div>

          {showScrollButton && (
            <Button
              variant="ghost"
              className="absolute px-1 py-1 bottom-4 right-4 rounded-full shadow-sm w-12 h-12 flex items-center justify-center"
              onClick={scrollToBottom}
            >
              <ChevronsDown className="w-6 h-6" />
            </Button>
          )}
        </ScrollAreaPrimitive.Viewport>
        <ScrollBar />
        <ScrollAreaPrimitive.Corner />
      </ScrollAreaPrimitive.Root>
    );
  },
);
MtScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

export const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-px",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-px",
      className,
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb
      className={cn(
        "bg-border relative rounded-full",
        orientation === "vertical" && "flex-1",
      )}
    />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;
