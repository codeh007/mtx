import { cookies } from "next/headers";

// import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from "mtxuilib/ui/sidebar";
import { AppSidebar } from "../../../components/aichatbot/app-sidebar";
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
      {/* <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="beforeInteractive"
        async={true}
      /> */}
      <SidebarProvider defaultOpen={!isCollapsed}>
        <AppSidebar user={session?.user} />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </>
  );
}
