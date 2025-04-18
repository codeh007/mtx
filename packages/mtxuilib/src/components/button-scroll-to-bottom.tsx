"use client";

import { Button } from "react-day-picker";
import { IconArrowDown } from "../icons/icons-ai";
import { cn } from "../lib/utils";
import type { ButtonProps } from "../ui/button";

interface ButtonScrollToBottomProps extends ButtonProps {
	isAtBottom: boolean;
	scrollToBottom: () => void;
}

export function ButtonScrollToBottom({
	className,
	isAtBottom,
	scrollToBottom,
	...props
}: ButtonScrollToBottomProps) {
	return (
		<Button
			variant="outline"
			size="icon"
			className={cn(
				"absolute right-4 top-1 z-10 bg-background transition-opacity duration-300 sm:right-8 md:top-2",
				isAtBottom ? "opacity-0" : "opacity-100",
				className,
			)}
			onClick={() => scrollToBottom()}
			{...props}
		>
			<IconArrowDown />
			<span className="sr-only">Scroll to bottom</span>
		</Button>
	);
}
