import "@xterm/xterm/css/xterm.css";
import { MtmaiProvider } from "mtmaiui/stores/StoreProvider";
import { fontSans } from "mtxuilib/fonts";
import { cn } from "mtxuilib/lib/utils";
import "mtxuilib/styles/globals.css";
import { SidebarProvider } from "mtxuilib/ui/sidebar";
import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { type ReactNode, Suspense } from "react";
import "react-toastify/dist/ReactToastify.css";
import "../../../styles/globals.css";
// import "../../../styles/index.scss";

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
  metadataBase: new URL("https://chat.vercel.ai"),
  title: "Next.js Chatbot Template",
  description: "Next.js chatbot template using the AI SDK.",
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

export default async function Layout(props: {
  children: ReactNode;
}) {
  const { children } = props;
  const coreConfig = await getCoreConfig();
  const hostName = (await headers()).get("host");

  return (
    // <html lang="en" suppressHydrationWarning data-theme="light">

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

      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Suspense>
          <MtmaiProvider
            accessToken={coreConfig?.accessToken}
            backends={coreConfig?.backends || []}
            hostName={hostName || ""}
          >
            <HatchatLoader>
              <SidebarProvider
                style={
                  {
                    // "--sidebar-width": "350px", //如果需要左侧双侧边栏 就设置为 350px
                  } as React.CSSProperties
                }
              >
                {children}
              </SidebarProvider>
            </HatchatLoader>
          </MtmaiProvider>
        </Suspense>
      </body>
    </html>
  );
}
