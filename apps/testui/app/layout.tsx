import "@xterm/xterm/css/xterm.css";
import { frontendGetConfig, initMtiaiClient } from "mtmaiapi";
import { MtmaiuiLoaderScript } from "mtmaiui/components/MtmaiuiLoader";
import { MtmaiProvider } from "mtmaiui/stores/StoreProvider";
import { UIProviders } from "mtmaiui/stores/UIProviders";
import { ThemeHeaderScript } from "mtxuilib/components/themes/ThemeProvider";
import { fontSans } from "mtxuilib/fonts";
import { WebLayout } from "mtxuilib/layouts/web/WebLayout";
import { cn } from "mtxuilib/lib/utils";
import "mtxuilib/styles/globals.css";
import type { Metadata, Viewport } from "next";
import { cookies, headers } from "next/headers";
import type { ReactNode } from "react";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
export const runtime = "edge"; //nodejs
export const dynamic = "force-dynamic";
// initMtiaiClient();

export async function generateMetadata(): Promise<Metadata> {
    // return await ssGenerateMetadata();
}

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "white" },
        { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
};
// 将所有服务端逻辑抽离出来
// async function getLayoutData() {
//   const headersList = headers();
//   const hostName = headersList.get("host");
//   const frontendConfigResponse = await frontendGetConfig({});
//   const backendUrl = process.env.MTMAI_BACKEND;
//   let accessToken: string | undefined = undefined;

//   if (frontendConfigResponse.data?.cookieAccessToken) {
//     const cookieStore = cookies();
//     accessToken = cookieStore.get(
//       frontendConfigResponse.data?.cookieAccessToken,
//     )?.value;
//   }

//   return {
//     hostName,
//     backendUrl,
//     frontendConfig: frontendConfigResponse.data,
//     accessToken,
//   };
// }
export default async function Layout(props: {
    children: ReactNode;
}) {
    const { children } = props;
    const hostName = (await headers()).get("host");
    initMtiaiClient();
    const frontendConfigResponse = await frontendGetConfig({});
    const backendUrl = process.env.MTMAI_BACKEND;
    let accessToken: string | undefined = undefined;
    if (frontendConfigResponse.data?.cookieAccessToken) {
        accessToken = (await cookies()).get(
            frontendConfigResponse.data?.cookieAccessToken,
        )?.value;
    }

    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                {/* <ThemeHeaderScript /> */}
                {/* <MtmaiuiLoaderScript uiUrl={process.env.MTMAIUI_URL} /> */}
            </head>
            <body
                className={cn(
                    "min-h-screen bg-background font-sans antialiased",
                    fontSans.variable,
                )}
            >
                {/* <MtmaiProvider
          hostName={hostName}
          serverUrl={backendUrl}
          frontendConfig={frontendConfigResponse.data}
          accessToken={accessToken}
        >
          <UIProviders>
            <WebLayout>{children}</WebLayout>
          </UIProviders>
        </MtmaiProvider> */}
                {children}
            </body>
        </html>
    );
}
