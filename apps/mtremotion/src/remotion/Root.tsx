import { Composition } from "remotion";
// import {
//   COMP_NAME,
//   DURATION_IN_FRAMES,
//   VIDEO_FPS,
//   VIDEO_HEIGHT,
//   VIDEO_WIDTH,
//   defaultMyCompProps,
// } from "../types/schema";
import { NextLogo } from "./MyComp/NextLogo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* <Composition
        id={COMP_NAME}
        component={MainSence}
        durationInFrames={DURATION_IN_FRAMES}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        defaultProps={defaultMyCompProps}
      /> */}
      <Composition
        id="NextLogo"
        component={NextLogo}
        durationInFrames={300}
        fps={30}
        width={140}
        height={140}
        defaultProps={{
          outProgress: 0,
        }}
      />
      {/* <Composition
        id="SingleImageSence"
        component={SingleImageSence}
        durationInFrames={300}
        fps={30}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        defaultProps={{
          image: "https://picsum.photos/200/300",
          title: "场景: SingleImageSence",
        }}
      /> */}
    </>
  );
};
