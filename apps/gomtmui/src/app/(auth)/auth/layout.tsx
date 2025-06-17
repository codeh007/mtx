import { GomtmBackendProvider } from "@/stores/GomtmBackendProvider";
import { UIProviders } from "@/stores/UIProviders";
import "@/styles/globals.css";
import { ThemeHeaderScript } from "mtxuilib/components/themes/ThemeProvider";
import { fontSans } from "mtxuilib/fonts";
import { cn } from "mtxuilib/lib/utils";
import { Toaster } from "mtxuilib/ui/toaster";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeHeaderScript />
        {/* <MtmaiuiLoaderScript uiUrl={selfUrl} /> */}
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <GomtmBackendProvider>
          {/* <MtSuspenseBoundary> */}
          <UIProviders>
            {children}
            <Toaster />
          </UIProviders>
          {/* </MtSuspenseBoundary> */}
        </GomtmBackendProvider>
      </body>
    </html>
  );
}
