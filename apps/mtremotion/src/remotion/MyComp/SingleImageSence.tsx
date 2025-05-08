import { fontFamily } from "@remotion/google-fonts/Inter";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { TextFade } from "./TextFade";

export const SingleImageSenceSchema = z.object({
  senceType: z.literal("single_image"),
  image: z.string(),
  title: z.string(),
  duration: z.number().default(2000),
});

interface Props extends z.infer<typeof SingleImageSenceSchema> {
  className?: string;
}
/**
 * 单张图片场景
 * 基于 remotion 动画的单张图片场景
 * @returns
 */
export const SingleImageSence = (props: Props) => {
  const { image, title, duration, className } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill className={`${className}`}>
      <Sequence from={0}>
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
