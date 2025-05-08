"use client";
import { Player } from "@remotion/player";
import { Main } from "mtremotion/remotion/MyComp/Main";
import {
  type CompositionProps,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "mtremotion/types/constants";
import { useMemo } from "react";
import type { z } from "zod";

interface RemotionNextDemo1Props {
  title: string;
}
export const RemotionNextDemo1 = ({ title }: RemotionNextDemo1Props) => {
  const inputProps: z.infer<typeof CompositionProps> = useMemo(() => {
    return {
      title,
    };
  }, [title]);
  return (
    <div className="overflow-hidden rounded-geist shadow-[0_0_200px_rgba(0,0,0,0.15)] w-full min-h-[100px]">
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
  );
};
