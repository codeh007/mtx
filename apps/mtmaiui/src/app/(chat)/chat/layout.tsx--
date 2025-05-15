import { SidebarProvider } from "mtxuilib/ui/sidebar";
import Script from "next/script";
import { MtmaiProvider } from "../../../stores/StoreProvider";

export const experimental_ppr = true;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="beforeInteractive"
        async={true}
      />
      <MtmaiProvider>
        <SidebarProvider defaultOpen={true}>{children}</SidebarProvider>
      </MtmaiProvider>
    </>
  );
}
