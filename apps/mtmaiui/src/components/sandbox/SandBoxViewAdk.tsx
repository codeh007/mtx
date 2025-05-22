"use client";

import type { Sandbox } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { Button } from "mtxuilib/ui/button";
import { useCallback, useEffect } from "react";

export const SandBoxViewAdk = ({ sandbox }: { sandbox: Sandbox }) => {
  const runSseUrl = `${sandbox.url}/run_sse`;

  const examplePostData = {
    appName: "image2shorts_agent",
    userId: "user",
    sessionId: "fee33ab9-66a2-4937-9794-28d38f3b3c43",
    newMessage: {
      role: "user",
      parts: [
        {
          text: "nihao ",
        },
      ],
    },
    streaming: false,
  };

  const handleSse = useCallback((event: MessageEvent) => {
    console.log("SSE Message:", event.data);
  }, []);

  useEffect(() => {
    const sse = new EventSource(runSseUrl);

    sse.onmessage = handleSse;

    sse.onerror = (error) => {
      console.error("SSE Error:", error);
      sse.close();
    };

    sse.onopen = () => {
      console.log("SSE Connection opened");
    };

    return () => {
      sse.close();
    };
  }, [runSseUrl, handleSse]);
  return (
    <div className="flex flex-col gap-4 bg-blue-200 rounded-md p-4">
      <div>
        <div>
          <div>SandBoxViewAdk</div>
          <DebugValue data={sandbox} />

          <Button
            onClick={() => {
              fetch(runSseUrl, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(examplePostData),
              });
            }}
          >
            Run sse
          </Button>
        </div>
      </div>
    </div>
  );
};
