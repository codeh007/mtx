import { cookies, headers } from "next/headers";


import { auth } from "./auth";

import type { Metadata } from "next";

import { frontendGetConfig, initMtiaiClient } from "mtmaiapi";
import { MtmaiProvider } from "mtmaiui/stores/StoreProvider";
import { MtThemeProvider } from "mtxuilib/components/themes/ThemeProvider";
import { SidebarInset, SidebarProvider } from "mtxuilib/ui/sidebar";
import { Toaster } from "mtxuilib/ui/toaster";
import "../../styles/globals.css";

export const experimental_ppr = true;

export const metadata: Metadata = {
  metadataBase: new URL("https://chat.vercel.ai"),
  title: "Next.js Chatbot Template",
  description: "Next.js chatbot template using the AI SDK.",
};

export const viewport = {
  maximumScale: 1, // Disable auto-zoom on mobile Safari
};

const LIGHT_THEME_COLOR = "hsl(0 0% 100%)";
const DARK_THEME_COLOR = "hsl(240deg 10% 3.92%)";
const THEME_COLOR_SCRIPT = `\
(function() {
  var html = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
  function updateThemeColor() {
    var isDark = html.classList.contains('dark');
    meta.setAttribute('content', isDark ? '${DARK_THEME_COLOR}' : '${LIGHT_THEME_COLOR}');
  }
  var observer = new MutationObserver(updateThemeColor);
  observer.observe(html, { attributes: true, attributeFilter: ['class'] });
  updateThemeColor();
})();`;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, cookieStore] = await Promise.all([auth(), cookies()]);
  const isCollapsed = cookieStore.get("sidebar:state")?.value !== "true";
  const hostName = (await headers()).get("host");
  initMtiaiClient();
  const frontendConfigResponse = await frontendGetConfig({});
  const backendUrl = process.env.MTMAI_BACKEND;
  console.log(frontendConfigResponse.data);
  return (
    <html
      lang="en"
      // `next-themes` injects an extra classname to the body element to avoid
      // visual flicker before hydration. Hence the `suppressHydrationWarning`
      // prop is necessary to avoid the React hydration mismatch warning.
      // https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app
      suppressHydrationWarning
    >
      <head>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
          dangerouslySetInnerHTML={{
            __html: THEME_COLOR_SCRIPT,
          }}
        />
      </head>
      <body className="antialiased">
        <MtmaiProvider
          serverUrl={backendUrl}
          frontendConfig={frontendConfigResponse.data}
        >
          <MtThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster position="top-center" />
            <SidebarProvider defaultOpen={!isCollapsed}>
              {/* <AppSidebar user={session?.user} /> */}
              <SidebarInset>{children}</SidebarInset>
            </SidebarProvider>
          </MtThemeProvider>
        </MtmaiProvider>
      </body>
    </html>
  );
}
