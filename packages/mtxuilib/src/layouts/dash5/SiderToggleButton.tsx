"use client";
import { useDash5Store } from "./dash5.store";

// export type SiderToggleButtonProps = {};
export const SiderToggleButton = () => {
	const toggleAsideCollapsed = useDash5Store((x) => x.toggleAsideCollapsed);
	const isCollapsed = useDash5Store((x) => x.layoutConfig.asideIsCollapsed);
	return (
		<>
			{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
			<button
				onClick={() => toggleAsideCollapsed()}
				className="flex w-full items-center justify-center p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
				aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
			>
				{isCollapsed ? (
					// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M13 5l7 7-7 7M5 5l7 7-7 7"
						/>
					</svg>
				) : (
					// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
						/>
					</svg>
				)}
			</button>
		</>
	);
};
