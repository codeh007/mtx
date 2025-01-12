import { fontSans } from "mtxuilib/fonts";
import "mtxuilib/styles/globals.css";
import type { Viewport } from "next";
import { cookies, headers } from "next/headers";
import { Suspense, type ReactNode } from "react";

import { UIProviders } from "mtmaiui/stores/UIProviders";
import { frontendGetConfig, initMtiaiClient } from "mtmaiapi";

import { cn } from "mtxuilib/lib/utils";
import { MtmaiProvider } from "../../stores/StoreProvider";
import { MustLogin } from "../../components/MustLogin";
import { ThemeHeaderScript } from "mtxuilib/components/themes/ThemeProvider";
import { SidebarProvider } from "mtxuilib/ui/sidebar";
import { GomtmRuntimeProvider } from "../../stores/gomtm-runtime-privider";
import { HatchatLoader } from "../../components/HatchatLoader";
import "./globals.css";

export const runtime = "edge";
export const dynamic = "force-dynamic";

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

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeHeaderScript />
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
          <MustLogin>
            <Suspense>
              <HatchatLoader>
                <GomtmRuntimeProvider>
                  <UIProviders>
                    <SidebarProvider
                      style={
                        {
                          // "--sidebar-width": "350px", //如果需要左侧双侧边栏 就设置为 350px
                        } as React.CSSProperties
                      }
                    >
                      {children}
                    </SidebarProvider>
                    {/* <ServerSwitch /> */}
                  </UIProviders>
                </GomtmRuntimeProvider>
              </HatchatLoader>
            </Suspense>
          </MustLogin>
        </MtmaiProvider>
      </body>
    </html>
  );
}
