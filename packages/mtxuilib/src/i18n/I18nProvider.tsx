"use client";
import type { PropsWithChildren } from "react";
import { i18nSetupLocalization } from "./i18n";

i18nSetupLocalization();

export function I18nProvider({ children }: PropsWithChildren) {
  // 如果需要，可以在这里添加i18n的逻辑
  return <>{children}</>;
}
