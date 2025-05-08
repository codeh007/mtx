import { fontFamily, loadFont } from "@remotion/google-fonts/Inter";
import { AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { z } from "zod";
import { NextLogo } from "./NextLogo";
import { Rings } from "./Rings";
import { TextFade } from "./TextFade";
import type { CompositionProps } from "../../types/constants";

loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "700"],
});
export const Main = ({ title }: z.infer<typeof CompositionProps>) => {
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
    <AbsoluteFill className="bg-white">
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
      </Sequence>
    </AbsoluteFill>
  );
};
