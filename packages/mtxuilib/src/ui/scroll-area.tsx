"use client";

import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import * as React from "react";

import { cn } from "../lib/utils";

/**
 * 技巧1: 自动适配高度，关键在于父容器的高度设置
 * 典型用例：
 * 		<div className="flex h-screen">
      父容器限制了高度后，后面的ScrollArea自动出现滚动条 适用于 flex-grow 等布局情况。
			<div className="flex-1 flex flex-col">
				<header className="bg-blue-500 text-white p-4">
					<h1>Header</h1>
				</header>
				<main className="flex-1 overflow-hidden">
					<ScrollArea className="h-full">
						<div className="p-4">
							{Array.from({ length: 50 }, (_, i) => (
								<p key={i} className="mb-4">Content line {i + 1}</p>
							))}
						</div>
					</ScrollArea>
				</main>
				<footer className="bg-gray-200 p-4">
					<p>Footer</p>
				</footer>
			</div>
		</div>
 */
const ScrollArea = React.forwardRef<
	React.ElementRef<typeof ScrollAreaPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
	<ScrollAreaPrimitive.Root
		ref={ref}
		className={cn("relative overflow-hidden", className)}
		{...props}
	>
		<ScrollAreaPrimitive.Viewport className="size-full rounded-[inherit]">
			{children}
		</ScrollAreaPrimitive.Viewport>
		<ScrollBar />
		<ScrollAreaPrimitive.Corner />
	</ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
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

export { ScrollArea, ScrollBar };

export const ScrollAreaViewport = React.forwardRef<
	React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaViewport>,
	React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaViewport>
>(({ children, ...props }, ref) => {
	return (
		<ScrollAreaPrimitive.Viewport ref={ref} {...props}>
			{children}
		</ScrollAreaPrimitive.Viewport>
	);
});
ScrollAreaViewport.displayName =
	ScrollAreaPrimitive.ScrollAreaViewport.displayName;
