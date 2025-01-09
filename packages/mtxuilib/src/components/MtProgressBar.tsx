"use client";
import { AppProgressBar } from "next-nprogress-bar";

export const MtProgressBar = () => {
  return (
    <AppProgressBar
      height="4px"
      color="#4934eb"
      options={{ showSpinner: false }}
      shallowRouting
    />
  );
};
