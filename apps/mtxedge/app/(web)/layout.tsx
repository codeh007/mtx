import { fontSans } from "mtxuilib/fonts";
import "mtxuilib/styles/globals.css";
import type { Viewport } from "next";
import { headers } from "next/headers";
import type { ReactNode } from "react";

// import { UIProviders } from "mtmaiui/stores/UIProviders";

import { getBackendUrl } from "mtxuilib/lib/sslib";
import { cn } from "mtxuilib/lib/utils";
// import { MtmaiapiProvider } from "../../context/MtmaiapiProvider";
// import { MtmaiProvider } from "../../context/StoreProvider";
// import { getCoreConfig } from "../../lib/core/coreConfig";
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

  // const coreConfig = await getCoreConfig();

  const hostName = (await headers()).get("host");
  const backendUrl = await getBackendUrl();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        {/* <MtmaiProvider
          accessToken={coreConfig?.accessToken}
          backends={coreConfig?.backends || []}
          hostName={hostName || ""}
        >
          <MtmaiapiProvider
            serverUrl={coreConfig.backends[0]}
            accessToken={coreConfig.accessToken}
          >
            <UIProviders> */}
              {children}
            {/* </UIProviders>
          </MtmaiapiProvider>
        </MtmaiProvider> */}
      </body>
    </html>
  );
}
