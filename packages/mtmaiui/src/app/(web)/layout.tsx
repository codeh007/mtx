import { fontSans } from "mtxuilib/fonts";
import "mtxuilib/styles/globals.css";
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
import "./globals.css";
// import dynamic from "next/dynamic";

// export const runtime = "edge";
export const runtime = "nodejs"; //nodejs

// export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

// const DashSlot = dynamic(
//   () => import('./@dash/default'),
//   { 
//     ssr: false,
//     loading: () => <div>Loading dashboard...</div>
//   }
// )

export default async function Layout(props: {
  children: ReactNode;
  dash: ReactNode;
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
              {/* <HatchatLoader>
                <GomtmRuntimeProvider> */}
                  <UIProviders>
                    <SidebarProvider
                      style={
                        {
                          // "--sidebar-width": "350px", //如果需要左侧双侧边栏 就设置为 350px
                        } as React.CSSProperties
                      }
                    >
                      {children}
                      {dash}
                      {/* <DashSlot/> */}
                    </SidebarProvider>
                    {/* <ServerSwitch /> */}
                    
                  </UIProviders>
                {/* </GomtmRuntimeProvider>
              </HatchatLoader> */}

          
        </MtmaiProvider>
      </body>
    </html>
  );
}
