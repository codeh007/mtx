"use server";

import { getAppConfig } from "@/lib/config";
import { cookies } from "next/headers";
import { MtmaiProvider } from "./MtmaiProvider";
import { UIProviders } from "./UIProviders";

/**
 * 运行在 nextjs 后端,用于初始化后端的必要状态
 * 特别是对于SSR 的情况下 cookies 的初始化
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
				{children}
			</UIProviders>
		</MtmaiProvider>
	);
};
