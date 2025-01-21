import { frontendGetConfig, initMtiaiClient } from "mtmaiapi";
import { UIProviders } from "mtmaiui/stores/UIProviders";
import { fontSans } from "mtxuilib/fonts";
import type { Viewport } from "next";
import { cookies, headers } from "next/headers";
import type { ReactNode } from "react";

import { ThemeHeaderScript } from "mtxuilib/components/themes/ThemeProvider";
import { WebLayout } from "mtxuilib/layouts/web/WebLayout";
import { WebLayoutHeader } from "mtxuilib/layouts/web/WebLayoutHeader";
import { getBackendUrl } from "mtxuilib/lib/sslib";
import { cn } from "mtxuilib/lib/utils";
import "mtxuilib/styles/globals.css";
import { MtSessionProvider } from "../../stores/MtSessionProvider";
import { MtmaiProvider } from "../../stores/StoreProvider";
import "./globals.css";
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
  const selfBackendUrl = await getBackendUrl();
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
          frontendConfig={frontendConfigResponse.data}
          hostName={hostName!}
          serverUrl={backendUrl}
          selfBackendUrl={selfBackendUrl}
          accessToken={accessToken}
        >
          <MtSessionProvider>
            <UIProviders>
              <WebLayout>
                <WebLayoutHeader />
                {children}
              </WebLayout>
            </UIProviders>
          </MtSessionProvider>
        </MtmaiProvider>
      </body>
    </html>
  );
}
