"use client";

import { memo } from "react";

export const genericMemo: <
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	T extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>,
>(
	component: T,
	propsAreEqual?: (
		prevProps: React.ComponentProps<T>,
		nextProps: React.ComponentProps<T>,
	) => boolean,
) => T & { displayName?: string } = memo;
