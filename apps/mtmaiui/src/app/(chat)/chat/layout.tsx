import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { SidebarInset, SidebarProvider } from "mtxuilib/ui/sidebar";
import { cookies } from "next/headers";
import Script from "next/script";
import { AppSidebar } from "../../../aichatbot/app-sidebar";
import { auth } from "../../../lib/auth/auth";

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
      <SidebarProvider defaultOpen={!isCollapsed}>
        <MtSuspenseBoundary>
          <AppSidebar user={session?.user} />
        </MtSuspenseBoundary>
        <MtSuspenseBoundary>
          <SidebarInset>{children}</SidebarInset>
        </MtSuspenseBoundary>
      </SidebarProvider>
    </>
  );
}
