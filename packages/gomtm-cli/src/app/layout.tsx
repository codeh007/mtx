// import "@xterm/xterm/css/xterm.css";
// import "mtxuilib/styles/globals.css";
// import type { Viewport } from "next";
// import type { ReactNode } from "react";
// import "react-toastify/dist/ReactToastify.css";
// import "../../styles/globals.css";
export const runtime = "edge"; //nodejs
export const dynamic = "force-dynamic";

export default async function Layout(props: {
  children: ReactNode;
}) {
  const { children } = props;
  return (
    <html lang="en" suppressHydrationWarning>
      <head></head>
      <body>{children}</body>
    </html>
  );
}
