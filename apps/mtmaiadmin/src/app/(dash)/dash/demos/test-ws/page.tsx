"use client";

import { Button } from "mtxuilib/ui/button";


export default function Page(props: { params: any }) {
  const handleClick = () => {
    const ws = new WebSocket("wss://mtcfworkflow.yuepa8.com/ws/ws");
    ws.onmessage = (event) => {
      console.log("on websocket message", event);
    };
  };

  const handleClickSse = async () => {
    const url =
      "https://3500-gitpoddemos-votingapp-wxu2os2so2c.ws-us117.gitpod.io/api/mtm/agent/run";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: "你好，请用中文向我打招呼，并且自我介绍",
        messages: [
          {
            role: "system",
            content:
              "你是文章标题生成器，现在根据用户输入的主题生成一个文章标题，注意不要啰嗦和解释，直接给出文章标题",
          },
          { role: "user", content: `我文章的主题是 seo` },
        ],
      }),
    });
  };

  return (
    <>
      <Button onClick={handleClick}>connect</Button>
      <Button onClick={handleClickSse}>sse</Button>
    </>
  );
}
