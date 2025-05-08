"use client";
import { Player, type PlayerRef } from "@remotion/player";
import { useRef } from "react";
import type { z } from "zod";
import { MainSence } from "../remotion/MyComp/Main";
import { type MainSenceSchema, VIDEO_FPS, VIDEO_HEIGHT, VIDEO_WIDTH } from "../types/constants";

interface MainSencePlayerProps {
  mainSenceData: z.infer<typeof MainSenceSchema>;
}
export const MainSencePlayer = ({ mainSenceData }: MainSencePlayerProps) => {
  const playerRef = useRef<PlayerRef>(null);

  // 总时长
  const totalDuration = mainSenceData.subScenes.reduce((acc, scene) => acc + scene.duration, 0);
  // 总帧数
  const durationInFrames = totalDuration * VIDEO_FPS;
  return (
    <div className="overflow-hidden rounded-geist shadow-[0_0_200px_rgba(0,0,0,0.15)] w-full min-h-[100px]">
      <Player
        ref={playerRef}
        component={MainSence}
        inputProps={mainSenceData}
        durationInFrames={durationInFrames}
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
