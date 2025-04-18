"use client";

import {
	Toast,
	ToastClose,
	ToastDescription,
	ToastProvider,
	ToastTitle,
	ToastViewport,
} from "./toast";
import { useToast } from "./use-toast";

/**
 * 这个可能已经过时了，因为官网使用了： sonner
 * 见： https://ui.shadcn.com/docs/components/sonner
 * @returns
 */
export function Toaster() {
	const { toasts } = useToast();

	return (
		<ToastProvider>
			{/* biome-ignore lint/complexity/useArrowFunction: <explanation> */}
			{toasts.map(function ({ id, title, description, action, ...props }) {
				return (
					<Toast key={id} {...props}>
						<div className="grid gap-1">
							{title && <ToastTitle>{title}</ToastTitle>}
							{description && (
								<ToastDescription>{description}</ToastDescription>
							)}
						</div>
						{action}
						<ToastClose />
					</Toast>
				);
			})}
			<ToastViewport />
		</ToastProvider>
	);
}
