import { SidebarProvider } from "mtxuilib/ui/sidebar";
import { cookies } from "next/headers";
import Script from "next/script";
import { auth } from "../../../lib/auth/auth";
import { MtmaiProvider } from "../../../stores/StoreProvider";

export const experimental_ppr = true;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, cookieStore] = await Promise.all([auth(), cookies()]);
  const isCollapsed = cookieStore.get("sidebar:state")?.value !== "true";

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="beforeInteractive"
        async={true}
      />
      <MtmaiProvider>
        <SidebarProvider defaultOpen={!isCollapsed}>{children}</SidebarProvider>
      </MtmaiProvider>
    </>
  );
}
