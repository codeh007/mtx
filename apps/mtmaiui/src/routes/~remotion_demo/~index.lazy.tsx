import { Player } from "@remotion/player";
import { createLazyFileRoute } from "@tanstack/react-router";
// import { Main } from "../../remotion/MyComp/Main";
import { Main } from "mtremotion/remotion/MyComp/Main";
import {
  type CompositionProps,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "mtremotion/types/constants";
import { Button } from "mtxuilib/ui/button";
import { useMemo, useState } from "react";
import type { z } from "zod";

export const Route = createLazyFileRoute("/remotion_demo/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [text, setText] = useState<string>("一些文字222");
  const inputProps: z.infer<typeof CompositionProps> = useMemo(() => {
    return {
      title: text,
    };
  }, [text]);
  return (
    <div>
      <div className="overflow-hidden rounded-geist shadow-[0_0_200px_rgba(0,0,0,0.15)] mb-10 mt-16">
        <Player
          component={Main}
          inputProps={inputProps}
          durationInFrames={DURATION_IN_FRAMES}
          fps={VIDEO_FPS}
          compositionHeight={VIDEO_HEIGHT}
          compositionWidth={VIDEO_WIDTH}
          style={{
            // Can't use tailwind class for width since player's default styles take presedence over tailwind's,
            // but not over inline styles
            width: "100%",
          }}
          controls
          autoPlay
          loop
        />
      </div>

      <Button
        onClick={() => {
          //TOD: 基于: https://www.remotion.dev/ 开源组件库
          // 导出 mp4
        }}
      >
        导出 mp4
      </Button>
      {/* <RenderControls text={text} setText={setText} inputProps={inputProps} /> */}
    </div>
  );
}
