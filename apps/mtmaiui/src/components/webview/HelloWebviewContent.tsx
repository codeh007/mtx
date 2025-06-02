"use client";

import { Button } from "mtxuilib/ui/button";


export function HelloWebviewContent() {
  
  return <div className="flex flex-col w-full bg-red-200">
    <h2 className="text-2xl font-bold bg-red-500">MtmJsTest</h2>
    <a href="https://www.bing.com" className="text-blue-500">Bing</a>

    <Button onClick={() => {
      console.log("Click me");
      // @ts-ignore
      const mtmadbot = window.mtmadbot as unknown as any
      if (mtmadbot) {
        mtmadbot.showToast("Hello from webview");
      }
    }}>Test toast</Button>
  </div>;
}

