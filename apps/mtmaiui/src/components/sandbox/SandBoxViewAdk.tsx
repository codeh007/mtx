"use client";

import type { Sandbox } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { useCallback, useEffect } from "react";

export const SandBoxViewAdk = ({ sandbox }: { sandbox: Sandbox }) => {
  const runSseUrl = sandbox.url;

  const handleSse = useCallback((event: MessageEvent) => {
    console.log(event);
  }, []);

  useEffect(() => {
    // 提示: new EventSource 似乎时原生的 SSE api (待学习)
    const sse = new EventSource(runSseUrl);
    sse.onmessage = (event) => {
      // handleSse(event);
      console.log("EventSource", event);
    };
  }, [runSseUrl]);
  return (
    <div className="flex flex-col gap-4 bg-blue-500">
      <div>
        <div>
          <div>SandBoxViewAdk</div>
          <DebugValue data={sandbox} />
        </div>
      </div>
    </div>
  );
};
