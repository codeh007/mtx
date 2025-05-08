import { fontFamily, loadFont } from "@remotion/google-fonts/Inter";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "remotion";
import type { z } from "zod";
import { Subtitles } from "../../components/Subtitles";
import type { MainSenceSchema } from "../../types/schema";
import { NextLogoSence } from "./NextLogoSence";
import { TextFade } from "./TextFade";
loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "700"],
});
export const MainSence = (props: z.infer<typeof MainSenceSchema>) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { title, subScenes, speechUrl, bgmUrl, subtitles } = props;
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
        // 计算开始时间 - 累加之前所有场景的时长
        const fromSeconds = subScenes
          .slice(0, index)
          .reduce((acc, s) => acc + s.duration / 1000, 0);

        // 转换为帧数
        const fromFrames = Math.round(fromSeconds * fps);
        const durationFrames = Math.round(durationSeconds * fps);

        return (
          <Sequence key={index} from={fromFrames} durationInFrames={durationFrames}>
            <TextFade>
              <h1
                className="text-[70px] font-bold text-white text-center tracking-wider uppercase"
                style={{
                  fontFamily,
                  textShadow: `
                    -2px -2px 0 #000,  
                    2px -2px 0 #000,
                    -2px 2px 0 #000,
                    2px 2px 0 #000,
                    0 0 20px rgba(255,255,255,0.5)
                  `,
                  WebkitTextStroke: "2px black",
                  background: "linear-gradient(to bottom, #ffffff 0%, #f0f0f0 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {scene.title}
              </h1>
            </TextFade>
            <img src={scene.image} alt="video-image" className="w-full h-full" />
            <div className="text-white text-2xl z-10 absolute top-0 left-0">
              {index},{subScenes.length}, from: {fromSeconds}, duration: {scene.duration},
              fromFrames: {fromFrames}, durationFrames: {durationFrames}
            </div>
          </Sequence>
        );
      })}

      {/* 人声解说 */}
      {/* {speechUrl && ( */}
      <Sequence from={0} durationInFrames={1000}>
        <Audio
          src={
            "https://text.pollinations.ai/%E5%8B%87%E6%95%A2%E6%88%98%E6%96%97?model=openai-audio&voice=alloy"
          }
        />
      </Sequence>
      {/* )} */}

      {/* 背景音乐 */}
      {bgmUrl && (
        <Sequence from={0}>
          <Audio src={bgmUrl} />
        </Sequence>
      )}

      {/* 字幕 */}
      {subtitles && (
        <Sequence from={0}>
          <Subtitles />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};
