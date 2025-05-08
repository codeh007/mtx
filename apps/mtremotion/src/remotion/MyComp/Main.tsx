import { loadFont } from "@remotion/google-fonts/Inter";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { z } from "zod";
import type { MainSenceSchema } from "../../types/constants";
import { NextLogoSence } from "./NextLogoSence";
import { SingleImageSence } from "./SingleImageSence";

loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "700"],
});
export const MainSence = ({ title, subScenes }: z.infer<typeof MainSenceSchema>) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!subScenes || subScenes.length === 0) {
    return (
      <>
        <NextLogoSence title={title} />
      </>
    );
  }
  // 有场景, 依次播放每个场景
  return (
    <AbsoluteFill className="bg-slate-500">
      {subScenes?.map((scene, index) => {
        const durationSeconds = scene.duration / 1000;
        const fromSeconds = index === 0 ? 0 : durationSeconds;
        // const secondToFrames = index === 0 ? 0 : 10 + index * 10;
        // const positionOffset = index === 0 ? 0 : 10 + index * 10;

        // 时间端->帧数
        const fromFrames = fromSeconds * fps;
        const toFrames = fromFrames + durationSeconds * fps;

        return (
          <Sequence key={index} from={fromFrames} durationInFrames={toFrames - fromFrames}>
            <SingleImageSence {...scene} />
            <div className="text-white text-2xl z-10 absolute top-0 left-0">
              {index},{subScenes.length}, from: {fromSeconds}, duration: {scene.duration},
              fromFrames: {fromFrames}, toFrames: {toFrames}
            </div>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

// const SequenceSecondToFrames = (
//   props: React.PropsWithChildren<{
//     secondFrom: number;
//     secondTo: number;
//   }>,
// ) => {
//   const { secondFrom, secondTo, children } = props;
//   const { fps } = useVideoConfig();
//   const from = secondFrom * fps;
//   const to = secondTo * fps;
//   return (
//     <Sequence from={from} durationInFrames={to - from}>
//       {children}
//     </Sequence>
//   );
// };

const Title: React.FC<{ title: string }> = ({ title }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  return <div style={{ opacity, textAlign: "center", fontSize: "7em" }}>{title}</div>;
};
