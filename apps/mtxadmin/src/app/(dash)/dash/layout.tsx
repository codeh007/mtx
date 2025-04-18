import "@xterm/xterm/css/xterm.css";
import { frontendGetConfig } from "mtmaiapi";
import { MtmaiProvider } from "mtmaiui/stores/StoreProvider";
import { UIProviders } from "mtmaiui/stores/UIProviders";
import { ThemeHeaderScript } from "mtxuilib/components/themes/ThemeProvider";
import { fontSans } from "mtxuilib/fonts";
import { cn } from "mtxuilib/lib/utils";
import "mtxuilib/styles/globals.css";
import { SidebarProvider } from "mtxuilib/ui/sidebar";
import type { Metadata, Viewport } from "next";
import { cookies, headers } from "next/headers";
import { type ReactNode, Suspense } from "react";
import "react-toastify/dist/ReactToastify.css";
import "../../../styles/globals.css";
export const runtime = "nodejs"; //nodejs

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  maximumScale: 1, // Disable auto-zoom on mobile Safari
};

export const experimental_ppr = true;
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  metadataBase: new URL("https://www.yuepa8.com"),
  title: "Next.js Chatbot Template",
  description: "Next.js chatbot template using the AI SDK.",
};

export default async function Layout(props: {
  children: ReactNode;
}) {
  const { children } = props;
  const hostName = (await headers()).get("host");
  // initMtiaiClient();
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
                {/* <GomtmRuntimeProvider> */}
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
                {/* </GomtmRuntimeProvider> */}
              </HatchatLoader>
            </Suspense>
          </MustLogin>
        </MtmaiProvider>
      </body>
    </html>
  );
}
