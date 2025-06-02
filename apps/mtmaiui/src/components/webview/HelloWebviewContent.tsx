"use client";

import { Button } from "mtxuilib/ui/button";
import { useState } from "react";

export function HelloWebviewContent() {

  const [test1, setTest1] = useState("");
  
  return <div className="flex flex-col w-full bg-red-200">
    <h2 className="text-2xl font-bold bg-red-500">HelloWebviewContent</h2>
    <Button onClick={() => {
      console.log("Click me");
      // @ts-ignore
      const mtmadbot = window.mtmadbot as unknown as any
      if (mtmadbot) {
        mtmadbot.showToast("Hello from webview");
        setTest1("mtmadbot");
      }else{
        setTest1("没有mtmadbot");
      }
    }}>Test toast : {test1}</Button>
  </div>;
}

