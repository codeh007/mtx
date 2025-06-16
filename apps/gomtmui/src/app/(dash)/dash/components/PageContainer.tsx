"use client";

import { cn } from "mtxuilib/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "mtxuilib/ui/card";
import type { ReactNode } from "react";

interface PageContainerProps {
	children: ReactNode;
	title?: string;
	description?: string;
	actions?: ReactNode;
	className?: string;
	variant?: "default" | "card";
}

export function PageContainer({
	children,
	title,
	description,
	actions,
	className,
	variant = "default",
}: PageContainerProps) {
	if (variant === "card") {
		return (
			<div className={cn("space-y-6", className)}>
				{(title || description || actions) && (
					<div className="flex items-center justify-between">
						<div>
							{title && <h1 className="text-3xl font-bold tracking-tight">{title}</h1>}
							{description && (
								<p className="text-muted-foreground mt-2">{description}</p>
							)}
						</div>
						{actions && <div className="flex items-center gap-2">{actions}</div>}
					</div>
				)}
				<Card>
					<CardContent className="p-6">
						{children}
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className={cn("space-y-6", className)}>
			{(title || description || actions) && (
				<div className="flex items-center justify-between">
					<div>
						{title && <h1 className="text-3xl font-bold tracking-tight">{title}</h1>}
						{description && (
							<p className="text-muted-foreground mt-2">{description}</p>
						)}
					</div>
					{actions && <div className="flex items-center gap-2">{actions}</div>}
				</div>
			)}
			{children}
		</div>
	);
}
