import { fontFamily, loadFont } from "@remotion/google-fonts/Inter";
import { AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { NextLogo } from "../MyComp/NextLogo";
import { Rings } from "../MyComp/Rings";
import { TextFade } from "../MyComp/TextFade";

loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "700"],
});

// 场景2 练习
export const Sence2 = () => {
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
            {/* {title} */}
          </h1>
        </TextFade>
        {/* <TextFade>
        <h2
            className="text-[20px]"
            style={{
              fontFamily,
            }}
          >
            {subtitle}
          </h2>
        </TextFade> */}
      </Sequence>
    </AbsoluteFill>
  );
};
