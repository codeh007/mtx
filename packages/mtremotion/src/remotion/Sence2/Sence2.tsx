import { fontFamily, loadFont } from "@remotion/google-fonts/Inter";
import React from "react";
import { AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { z } from "zod";
import type { CompositionProps } from "../../../types/constants";
import { NextLogo } from "./NextLogo";
import { Rings } from "./Rings";
import { TextFade } from "./TextFade";

loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "700"],
});

interface Sence2Props {
  title: string;
  subtitle: string;
}

// 场景2 练习
export const Sence2 = ({ title, subtitle }: Sence2Props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const transitionStart = 2 * fps;
  const transitionDuration = 1 * fps;

  const logoOut = spring({
    fps,
    frame,
    config: {
      damping: 200,
    },
    durationInFrames: transitionDuration,
    delay: transitionStart,
  });

  return (
    <AbsoluteFill className="bg-yellow-500">
      <Sequence durationInFrames={transitionStart + transitionDuration}>
        <Rings outProgress={logoOut} />
        <AbsoluteFill className="justify-center items-center">
          <NextLogo outProgress={logoOut} />
        </AbsoluteFill>
      </Sequence>
      <Sequence from={transitionStart + transitionDuration / 2}>
        <TextFade>
          <h1
            className="text-[70px] font-bold"
            style={{
              fontFamily,
            }}
          >
            {title}
          </h1>
          
        </TextFade>
        <TextFade>
        <h2
            className="text-[20px]"
            style={{
              fontFamily,
            }}
          >
            {subtitle}
          </h2>
        </TextFade>
      </Sequence>
    </AbsoluteFill>
  );
};
