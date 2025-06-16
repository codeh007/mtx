import { fontSans } from "mtxuilib/fonts";
import type { Viewport } from "next";
import type { ReactNode } from "react";

import { getAppConfig } from "@mtmaiui/lib/config";
import { MtmaiProvider } from "@mtmaiui/stores/MtmaiProvider";
import { UIProviders } from "@mtmaiui/stores/UIProviders";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { ThemeHeaderScript } from "mtxuilib/components/themes/ThemeProvider";
import { cn } from "mtxuilib/lib/utils";
import { cookies } from "next/headers";
import "../../../styles/globals.css";
import { DashboardLayout } from "./components/DashboardLayout";
export const runtime = "nodejs";
// export const dynamic = "force-dynamic";

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
};

export default async function Layout(props: {
	children: ReactNode;
}) {
	const { children } = props;
	const cookieStore = await cookies();
	const accessToken = cookieStore.get("access_token")?.value;
	const config = getAppConfig();
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<ThemeHeaderScript />
				{/* <MtmaiuiLoaderScript uiUrl={selfUrl} /> */}
			</head>
			<body
				className={cn(
					"min-h-screen bg-background font-sans antialiased",
					fontSans.variable,
				)}
			>
				<MtmaiProvider
					serverUrl={getAppConfig().mtmServerUrl}
					accessToken={accessToken}
					config={config}
				>
					<MtSuspenseBoundary>
						<UIProviders>
							<DashboardLayout>
								<MtSuspenseBoundary>{children}</MtSuspenseBoundary>
							</DashboardLayout>
							{/* <div id="gomtm-runtime-container" /> */}
						</UIProviders>
					</MtSuspenseBoundary>
				</MtmaiProvider>
			</body>
		</html>
	);
}
