"use client";


export function WebLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen h-full">
      {children}
    </div>
  );
}
