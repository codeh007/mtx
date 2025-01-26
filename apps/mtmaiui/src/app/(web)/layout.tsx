import { UIProviders } from "mtmaiui/stores/UIProviders";
import { fontSans } from "mtxuilib/fonts";
import type { Viewport } from "next";
import { cookies, headers } from "next/headers";
import type { ReactNode } from "react";

import { ThemeHeaderScript } from "mtxuilib/components/themes/ThemeProvider";
import { WebLayout } from "mtxuilib/layouts/web/WebLayout";
import { WebLayoutHeader } from "mtxuilib/layouts/web/WebLayoutHeader";
import { edgeApp } from "mtxuilib/lib/edgeapp";
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
  await edgeApp.init({
    headers: headers,
    cookies: cookies,
  });

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
          frontendConfig={await edgeApp.getFrontendConfig()}
          hostName={edgeApp.hostName}
          serverUrl={edgeApp.backend}
          selfBackendUrl={await edgeApp.getBackendUrl()}
          accessToken={await edgeApp.getAccessToken()}
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
