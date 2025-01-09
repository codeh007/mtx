import type { TOptions } from "i18next";
import { useTranslation as usei18nextTranslation } from "react-i18next";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const i18nConfig = {
  fallbackLng: "en-US",
  defaultNS: "translation",
};

let isSetuped = false;
export function i18nSetupLocalization(): void {
  if (isSetuped) {
    return;
  }
  isSetuped = true;
  i18n
    .use(initReactI18next)
    .init(i18nConfig)
    .catch((err) => console.error("[i18n] Failed to setup localization.", err));
}

type TranslatorProps = {
  path: string | string[];
  suffix?: string;
  options?: TOptions;
};

export const Translator = ({ path, options, suffix }: TranslatorProps) => {
  const { t, i18n } = usei18nextTranslation();

  if (!i18n.exists(path, options)) {
    // TODO: 用一个默认的skeleton组件
    return <div />;
  }

  return (
    <span>
      {t(path, options)}
      {suffix}
    </span>
  );
};

export const useTranslation = () => {
  const { t, ready, i18n } = usei18nextTranslation();

  return {
    t: (path: string | string[], options?: TOptions) => {
      if (!i18n.exists(path, options)) {
        return "...";
      }

      return t(path, options);
    },
    ready,
    i18n,
  };
};
