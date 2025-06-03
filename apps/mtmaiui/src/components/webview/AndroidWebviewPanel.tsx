"use client";

import { CustomLink } from "mtxuilib/mt/CustomLink";
import { Button } from "mtxuilib/ui/button";
import { useToast } from "mtxuilib/ui/use-toast";
import { useCallback, useEffect, useState } from "react";
import { getAndroidApi, isInWebview } from "./androidApi";

export function AndroidWebviewPanel() {
  const [version, setVersion] = useState("");

  const [isWebview, setIsWebview] = useState(false);

  const getInfo = useCallback(async () => {
    const infoJson = await getAndroidApi().getInfo();
    const infoObj = JSON.parse(infoJson);
    console.log(infoObj);
    setVersion(infoObj.version);
  }, []);

  const toast = useToast();

  useEffect(() => {
    setIsWebview(isInWebview());
  }, []);

  useEffect(() => {
    if (isWebview) {
      getInfo();
    }
  }, [isWebview, getInfo]);

  if (!isWebview) {
    return <div>请下载智能体客户端, 并打开智能体客户端</div>;
  }

  return (
    <div className="flex flex-col w-full p-2 gap-2">
      <div className="text-sm text-gray-500">{version}</div>
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
          const resJson = await getAndroidApi().activateNetworkProfile("11");
          toast.toast({
            title: "添加 singbox 配置",
            description: resJson,
          });
        }}
      >
        activateNetworkProfile
      </Button>

      <div>
        <CustomLink to="/site">site</CustomLink>
      </div>
    </div>
  );
}
