import { fontFamily } from "@remotion/google-fonts/Inter";
import { AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { NextLogo } from "../MyComp/NextLogo";
import { Rings } from "../MyComp/Rings";
import { TextFade } from "../MyComp/TextFade";

// loadFont("normal", {
//   subsets: ["latin"],
//   weights: ["400", "700"],
// });

export const SingleImageSenceSchema = z.object({
  senceType: z.literal("single_image"),
  image: z.string(),
  title: z.string(),
});

type Props = z.infer<typeof SingleImageSenceSchema>;
/**
 * 单张图片场景
 * 基于 remotion 动画的单张图片场景
 * @returns
 */
export const SingleImageSence = (props: Props) => {
  const { image, title } = props;
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
    <AbsoluteFill className="bg-yellow-100">
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
          <img src={image} alt="video-image" className="w-full h-full" />
        </TextFade>
      </Sequence>
    </AbsoluteFill>
  );
};
