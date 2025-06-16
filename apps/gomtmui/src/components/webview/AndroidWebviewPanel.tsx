"use client";

import { useMtmai } from "@mtmaiui/stores/MtmaiProvider";
import { Button } from "mtxuilib/ui/button";
import { useToast } from "mtxuilib/ui/use-toast";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  getAndroidApi,
  isInMtAdbotService,
  isInWebview,
  useDragWindow,
} from "../../lib/mtadbot_api/androidApi";

export function AndroidWebviewPanel() {
  const [version, setVersion] = useState("");
  const config = useMtmai((x) => x.config);

  const [uiIsAdmin, setUiIsAdmin] = useState(true);

  const [logs, setLogs] = useState<string[]>([]);

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
    const res = await window.floatingWindow.getWindowToolbarVisibility();
    const resObj = JSON.parse(res);
    // toast.toast({
    //   title: "getWindowToolbarVisibility",
    //   description: res,
    // });
    if (resObj.visible) {
      await window.floatingWindow.toggleWindowToolbar();
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

  const [isFloatingWindowViewVisible, setIsFloatingWindowViewVisible] = useState(false);
  useEffect(() => {
    if (window.floatingWindow?.isViewVisible) {
      const resJson = window.floatingWindow.isViewVisible();
      const res = JSON.parse(resJson);
      setIsFloatingWindowViewVisible(!!res.visible);
    }
  }, []);

  return (
    <div className="flex flex-col w-full p-2 gap-2 bg-blue-100 border border-slate-400 rounded-md">
      {isWebview && (
        <>
          <Button
            type="button"
            onClick={async () => {
              try {
                if (window.mtmadbot.isVpnServiceRunning()) {
                  // 已经连接的情况下,跳过
                  return;
                }
                const profileName = config.DefaultSingBoxProfileName;
                const profileUrl = config.DefaultSingBoxProfileUrl;
                const result = await window.mtmadbot.addSangBoxProfile(profileName, profileUrl);
                toast.toast({
                  title: "添加 singbox 配置",
                  description: JSON.stringify(result, null, 2),
                });
                const resJson = await window.mtmadbot.activateNetworkProfile(profileName);
                toast.toast({
                  title: "激活 singbox 配置",
                  description: resJson,
                });
              } catch (error: any) {
                toast.toast({
                  title: "连接网络失败",
                  description: `${error.message}\n${error.stack}`,
                });
              }
            }}
          >
            连接网络
          </Button>

          <Button
            type="button"
            onClick={async () => {
              try {
                const mtmadbot = window.mtmadbot;
                if (mtmadbot) {
                  mtmadbot.openFloatWindow(config?.mtmadbotFloatWindowUrl || "", "normal");
                }
                window.mtmadbot.closeMainActivity();

                // 启动 adb 服务
                
              } catch (e: any) {
                toast.toast({
                  title: "启动自动任务失败",
                  description: `${e.message}\n${e.stack}`,
                });
              }
            }}
          >
            启动
          </Button>

          {uiIsAdmin && (
            <>
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
                  const resJson = await getAndroidApi().shell("ls -l");
                  toast.toast({
                    title: "shell",
                    description: resJson,
                  });
                }}
              >
                shell
              </Button>
              {window.floatingWindow && (
                <div
                  id="floatingWindowDragArea"
                  ref={dragAreaRef}
                  className="flex flex-row h-10 bg-slate-100 shadow-sm rounded-md"
                >
                  {version}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
