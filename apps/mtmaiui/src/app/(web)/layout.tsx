import { fontSans } from "mtxuilib/fonts";
import type { Viewport } from "next";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { cn } from "mtxuilib/lib/utils";
import "../../styles/globals.css";
export const runtime = "nodejs";
// export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "MTMAIUI",
  description: "MTMAIUI Application",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function Layout(props: {
  children: ReactNode;
}) {
  const { children } = props;
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        {/* <ThemeHeaderScript /> */}
        {/* <MtmaiuiLoaderScript uiUrl={selfUrl} /> */}
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <div className="flex flex-col min-h-screen h-full w-full bg-blue-200">
          <div className="flex-1 bg-red-200">
            <div className="flex flex-col min-h-screen h-full w-full bg-red-200">
              <div className="flex-1">hello2</div>
              <div className="h-10">footer</div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
