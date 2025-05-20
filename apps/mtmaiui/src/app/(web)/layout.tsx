import { fontSans } from "mtxuilib/fonts";
import type { Viewport } from "next";
import type { ReactNode } from "react";

// import "../../styles/globals.css";
import { cn } from "mtxuilib/lib/utils";
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
  // await initGomtmApp({
  //   headers: headers,
  //   cookies: cookies,
  // });
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* <ThemeHeaderScript /> */}
        {/* <MtmaiuiLoaderScript uiUrl={selfUrl} /> */}
      </head>
      <body
        className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}
      ></body>
    </html>
  );
}
