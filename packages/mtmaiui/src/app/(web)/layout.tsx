import { fontSans } from "mtxuilib/fonts";
import type { Viewport } from "next";
import { cookies, headers } from "next/headers";
import type {  ReactNode } from "react";
import { UIProviders } from "mtmaiui/stores/UIProviders";
import { frontendGetConfig, initMtiaiClient } from "mtmaiapi";

import { cn } from "mtxuilib/lib/utils";
import { MtmaiProvider } from "../../stores/StoreProvider";
import { ThemeHeaderScript } from "mtxuilib/components/themes/ThemeProvider";
import { SidebarProvider } from "mtxuilib/ui/sidebar";
import { getBackendUrl } from "mtxuilib/lib/sslib";
import {WebLayoutHeader} from "mtxuilib/layouts/web/WebLayoutHeader"
import {WebLayout} from "mtxuilib/layouts/web/WebLayout"
import "mtxuilib/styles/globals.css";
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
  // dash: ReactNode;
}) {
  const { children, dash } = props;
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

  const selfUrl = await getBackendUrl();
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
          hostName={hostName}
          serverUrl={backendUrl}
          accessToken={accessToken}
        >
              
                {/* <GomtmRuntimeProvider>  */}
                  <UIProviders>
                    <SidebarProvider
                      style={
                        {
                          // "--sidebar-width": "350px", //如果需要左侧双侧边栏 就设置为 350px
                        } as React.CSSProperties
                      }
                    >
                      <WebLayout>
                      <WebLayoutHeader />
                      {children}
                      {/* {dash} */}
                      </WebLayout>
                    </SidebarProvider>
                    
                  </UIProviders>
                {/* </GomtmRuntimeProvider> */}

          
        </MtmaiProvider>
      </body>
    </html>
  );
}
