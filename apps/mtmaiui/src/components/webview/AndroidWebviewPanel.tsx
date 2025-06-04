"use client";

import { getMtAdbotFloatingApi, useDragWindow } from "@mtmaiui/lib/mtadbot_api/mtadbot_floating";
import { isInMtAdbotService } from "@mtmaiui/lib/mtadbot_api/mtadbot_service";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { Button } from "mtxuilib/ui/button";
import { useToast } from "mtxuilib/ui/use-toast";
import { useCallback, useEffect, useRef, useState } from "react";
import { MtadbotConsts, getAndroidApi, isInWebview } from "../../lib/mtadbot_api/androidApi";

export function AndroidWebviewPanel() {
  const [version, setVersion] = useState("");

  const [isWebview, setIsWebview] = useState(false);
  const [isInService, setIsInService] = useState(false);
  const dragAreaRef = useRef(null);
  useDragWindow(dragAreaRef);

  const getInfo = useCallback(async () => {
    const infoJson = await getAndroidApi().getInfo();
    const infoObj = JSON.parse(infoJson);
    setVersion(infoObj.version);
  }, []);

  const toast = useToast();

  const hiddenWindowToolbar = useCallback(async () => {
    const res = await getMtAdbotFloatingApi().getWindowToolbarVisibility();
    const resObj = JSON.parse(res);
    // toast.toast({
    //   title: "getWindowToolbarVisibility",
    //   description: res,
    // });
    if (resObj.visible) {
      await getMtAdbotFloatingApi().toggleWindowToolbar();
    }
  }, []);

  useEffect(() => {
    document.title = "MTADBot";
  }, []);

  useEffect(() => {
    setIsWebview(isInWebview());
    setIsInService(isInMtAdbotService());
  }, []);

  useEffect(() => {
    if (isWebview) {
      getInfo();
    }
  }, [isWebview, getInfo]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    hiddenWindowToolbar();
  }, []);

  return (
    <div className="flex flex-col w-full p-2 gap-2 bg-blue-100 border border-slate-400 rounded-md">
      {window.floatingWindow && (
        <div
          id="floatingWindowDragArea"
          ref={dragAreaRef}
          className="h-10 bg-slate-100 shadow-sm rounded-md"
        >
          {version}
        </div>
      )}

      {isWebview && (
        <>
          <Button
            onClick={() => {
              getAndroidApi().toast("Hello from webview");
            }}
          >
            toast
          </Button>

          <Button
            type="button"
            onClick={async () => {
              const resJson = await getAndroidApi().openSingbox();

              toast.toast({
                title: "打开 singbox",
                description: JSON.stringify(resJson),
              });
            }}
          >
            打开 singbox
          </Button>
          <Button
            type="button"
            onClick={async () => {
              const url = "https://ht8383.yuepa8.com/api/v1/singbox/subscribe/default/default";
              const resJson = await getAndroidApi().addSangBoxProfile(url);
              const res = JSON.parse(resJson);
              console.log(res);
              toast.toast({
                title: "添加 singbox 配置",
                description: res.message,
              });
            }}
          >
            添加 singbox 配置
          </Button>

          <Button
            type="button"
            onClick={async () => {
              const resJson = await getAndroidApi().activateNetworkProfile(
                MtadbotConsts.DefaultSingBoxProfileName,
              );
              toast.toast({
                title: "添加 singbox 配置",
                description: resJson,
              });
            }}
          >
            activateNetworkProfile
          </Button>

          <Button
            type="button"
            onClick={async () => {
              const resJson = await getAndroidApi().shell("ls -l");
              toast.toast({
                title: "shell",
                description: resJson,
              });
            }}
          >
            shell
          </Button>

          <Button
            type="button"
            onClick={async () => {
              const resJson = await getAndroidApi().openFloatWindow();
              toast.toast({
                title: "openFloatWindow",
                description: resJson,
              });
            }}
          >
            openFloatWindow
          </Button>

          <Button
            type="button"
            onClick={async () => {
              const resJson = await getAndroidApi().closeFloatWindow();
              toast.toast({
                title: "closeFloatWindow",
                description: resJson,
              });
            }}
          >
            closeFloatWindow
          </Button>

          <Button
            type="button"
            onClick={async () => {
              await getMtAdbotFloatingApi().toggleWindowToolbar();
            }}
          >
            toggleWindowToolbar
          </Button>

          <div>
            <CustomLink to="/site">site</CustomLink>
          </div>
        </>
      )}
    </div>
  );
}
