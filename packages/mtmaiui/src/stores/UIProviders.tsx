"use client";

import { MtErrorBoundary } from "mtxuilib/components/MtErrorBoundary";
// import { MtProgressBar } from "mtxuilib/components/MtProgressBar";
import { TailwindIndicator } from "mtxuilib/components/tailwind-indicator";
import { MtThemeProvider } from "mtxuilib/components/themes/ThemeProvider";
// import { SonnerToaster } from "mtxuilib/ui/sonner";
// import { Toaster } from "mtxuilib/ui/toaster";
import { TooltipProvider } from "mtxuilib/ui/tooltip";
import dynamic from "next/dynamic";
import type { PropsWithChildren } from "react";


const MtProgressBarLazy = dynamic(() => import("mtxuilib/components/MtProgressBar").then(x=>x.MtProgressBar), {
  ssr: false,
});

const SonnerToasterLazy = dynamic(() => import("mtxuilib/ui/sonner").then(x=>x.SonnerToaster), {
  ssr: false,
});
const ToasterLazy = dynamic(() => import("mtxuilib/ui/toaster").then(x=>x.Toaster), {
  ssr: false,
});

export const UIProviders = (props: PropsWithChildren) => {
  const { children } = props;
  return (
    <MtThemeProvider>
      <MtErrorBoundary>
        <MtProgressBarLazy />
        <TooltipProvider delayDuration={0}>
          {/* <ConfirmModalProvider> */}
          {/* <I18nProvider> */}
          {children}
          {/* </I18nProvider> */}
          {/* </ConfirmModalProvider> */}
          <SonnerToasterLazy position="top-center" />
          <ToasterLazy />
          <TailwindIndicator />
        </TooltipProvider>
      </MtErrorBoundary>
    </MtThemeProvider>
  );
};
