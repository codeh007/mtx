import Script from "next/script";
type MtmaiDevSrcProps = {
  uiUrl?: string;
};

/**
 * 加载后端脚本,(开发版或生产版)
 * @param props
 * @returns
 */
export function MtmaiuiLoaderScript(props: MtmaiDevSrcProps) {
  const scriptUrl = "/mtmaiui/mtmaiui_loader.js";
  return (
    <>
      <Script type="module" crossOrigin="anonymous" src={`${scriptUrl}`} />
    </>
  );
}
