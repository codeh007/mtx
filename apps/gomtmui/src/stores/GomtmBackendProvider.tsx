"use server";

import { getAppConfig } from "@/lib/config";
import { cookies } from "next/headers";
import { MtmaiProvider } from "./MtmaiProvider";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { UIProviders } from "./UIProviders";

/**
 * 运行在 nextjs 后端,用于初始化后端的必要状态
 *
 *
 */

export const GomtmBackendProvider = async ({
	children,
}: { children: React.ReactNode }) => {
	const config = getAppConfig();
	const cookieStore = await cookies();
	const accessToken = cookieStore.get("access_token")?.value;
	return (
		<MtmaiProvider
			serverUrl={getAppConfig().mtmServerUrl}
			accessToken={accessToken}
			config={config}
		>
			<UIProviders>
				<MtSuspenseBoundary>{children}</MtSuspenseBoundary>
			</UIProviders>
		</MtmaiProvider>
	);
};
