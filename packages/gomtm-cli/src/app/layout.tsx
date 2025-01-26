import type { ReactNode } from "react";
export const runtime = "edge"; //nodejs
export const dynamic = "force-dynamic";

export default async function Layout(props: {
  children: ReactNode;
}) {
  const { children } = props;
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
