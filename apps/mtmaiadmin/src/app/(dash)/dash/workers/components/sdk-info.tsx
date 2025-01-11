"use client";

import type { WorkerRuntimeSDKs } from "mtmaiapi/api";
import React, { FC } from "react";
import type { IconType } from "react-icons";
import { BiLogoGoLang, BiLogoPython, BiLogoTypescript } from "react-icons/bi";

export const SdkInfo: React.FC<{
  runtimeInfo?: { language?: WorkerRuntimeSDKs; sdkVersion?: string };
  iconOnly?: boolean;
}> = ({ runtimeInfo, iconOnly = false }) => {
  const SdkIcons: Record<WorkerRuntimeSDKs, IconType> = {
    GOLANG: BiLogoGoLang,
    PYTHON: BiLogoPython,
    TYPESCRIPT: BiLogoTypescript,
  };

  if (!runtimeInfo) {
    return null;
  }

  const Icon = runtimeInfo.language
    ? SdkIcons[runtimeInfo.language]
    : undefined;

  return (
    <div className="flex flex-row gap-2 items-center">
      {Icon && React.createElement(Icon)}
      {!iconOnly && runtimeInfo.sdkVersion}
    </div>
  );
};
