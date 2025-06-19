import type { ReactNode } from "react";

interface WebLayoutProps {
  children: ReactNode;
}

export function WebLayout({ children }: WebLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}