import Script from "next/script";
// import { MTMAIUILoader } from "../lib/mtmaiui_loader";
// import { useLayoutEffect } from "react";

// const loaderScriptName = "/mtmaiui_loader.js";
type MtmaiDevSrcProps = {
  uiUrl?: string;
};

/**
 * 加载后端脚本,(开发版或生产版)
 * @param props
 * @returns
 */
export function MtmaiuiLoaderScript(props: MtmaiDevSrcProps) {
  // const uiUrl = props.uiUrl || "http://localhost:6111";
  // // const uiUrl = props.uiUrl || "";

  // const uri = new URL(loaderScriptName, uiUrl);

  const scriptUrl = "/mtmaiui/mtmaiui_loader.js";
  // const scriptSrc =
  //   process.env?.NODE_ENV === "production"
  //     ? `${uiUrl}${loaderScriptName}`
  //     : `${uiUrl}${loaderScriptName}`;
  // useLayoutEffect(()=>{
  //   const loader = new MTMAIUILoader(uiUrl);
  //   loader.load().catch(console.error);
  // },[uiUrl])
  return (
    <>
      <Script type="module" crossOrigin="anonymous" src={`${scriptUrl}`} />

    </>
  );
}
