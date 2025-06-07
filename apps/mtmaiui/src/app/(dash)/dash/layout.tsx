import { fontSans } from "mtxuilib/fonts";
import type { Viewport } from "next";
import type { ReactNode } from "react";

import { MtmaiProvider } from "@mtmaiui/stores/MtmaiProvider";
import { ThemeHeaderScript } from "mtxuilib/components/themes/ThemeProvider";
import { cn } from "mtxuilib/lib/utils";
import "../../../styles/globals.css";
import { getAppConfig } from "@mtmaiui/lib/config";
import { UIProviders } from "@mtmaiui/stores/UIProviders";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { cookies } from "next/headers";
// import { WebLayoutHeader } from "./Header";
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
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <MtmaiProvider
          serverUrl={getAppConfig().mtmServerUrl}
          accessToken={accessToken}
          config={config}
        >
          <MtSuspenseBoundary>
            <UIProviders>
              <div className="flex flex-col min-h-screen h-full w-full">
                {/* <WebLayoutHeader /> */}
                <MtSuspenseBoundary>{children}</MtSuspenseBoundary>
                {/* <div id="gomtm-runtime-container" /> */}
              </div>
            </UIProviders>
          </MtSuspenseBoundary>
        </MtmaiProvider>
      </body>
    </html>
  );
}
