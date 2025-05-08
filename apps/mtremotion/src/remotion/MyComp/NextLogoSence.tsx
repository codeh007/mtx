import { fontFamily } from "@remotion/google-fonts/Inter";
import { AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { NextLogo } from "./NextLogo";
import { Rings } from "./Rings";
import { TextFade } from "./TextFade";
const NextLogoSenceSchema = z.object({
  title: z.string(),
});

export const NextLogoSence = ({ title }: z.infer<typeof NextLogoSenceSchema>) => {
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
    <>
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
    </>
  );
};
