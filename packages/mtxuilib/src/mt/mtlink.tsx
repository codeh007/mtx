"use client";

import { Slot } from "@radix-ui/react-slot";
import type { VariantProps } from "class-variance-authority";
import Link from "next/link";
import React, { type ComponentProps } from "react";
import { cn } from "../lib/utils";
import { buttonVariants } from "../ui/button";

export interface TMtLinkProps
	extends ComponentProps<typeof Link>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

export const MtLink = React.forwardRef<HTMLAnchorElement, TMtLinkProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : Link;
		return (
			<Comp
				className={cn(
					variant && buttonVariants({ variant: variant, className }),
				)}
				ref={ref}
				{...props}
			/>
		);
	},
);
MtLink.displayName = "MtLink";

type ExternalLinkProps = ComponentProps<"a">;

interface TExternalLink extends ExternalLinkProps {
	children?: React.ReactNode;
}

/**
 * 打开外部链接（功能还不完善）
 * @param param0
 * @returns
 */
export function MtExternalLink({
	children,
	className,
	...props
}: TExternalLink) {
	return (
		<a
			className={cn(
				className,
				"hover:text-brandtext-500 hover:underline hover:brightness-150",
			)}
			rel="noopener noreferrer"
			// target="_blank"
			{...props}
		>
			{children}
		</a>
	);
}
