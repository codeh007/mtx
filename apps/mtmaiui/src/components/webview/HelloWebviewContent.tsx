"use client";

import { Button } from "mtxuilib/ui/button";
import { useEffect, useState } from "react";
import { getAndroidApi, isInWebview } from "./androidApi";

export function HelloWebviewContent() {
  const [version, setVersion] = useState("");

  const [isWebview, setIsWebview] = useState(false);

  useEffect(() => {
    setIsWebview(isInWebview());
  }, []);

  if (!isWebview) {
    return null;
  }

  return (
    <div className="flex flex-col w-full bg-red-200">
      <h2 className="text-2xl font-bold bg-red-500">HelloWebviewContent</h2>
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
          const res = await getAndroidApi().getVersion();
          setVersion(res);
        }}
      >
        get version: {version}
      </Button>
    </div>
  );
}
