"use client";

import type { NextPage } from "next";
import { Spacing } from "../components/Spacing";
import { Tips } from "../components/Tips";

const Home: NextPage = () => {
  // const [text, setText] = useState<string>(defaultMyCompProps.title);

  // const inputProps: z.infer<typeof MainSenceSchema> = useMemo(() => {
  //   return {
  //     title: text,
  //   };
  // }, [text]);

  return (
    <div>
      <div className="max-w-screen-md m-auto mb-5">
        <div className="overflow-hidden rounded-geist shadow-[0_0_200px_rgba(0,0,0,0.15)] mb-10 mt-16">
          {/* <Player
            component={MainSence}
            inputProps={inputProps}
            durationInFrames={DURATION_IN_FRAMES}
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
          /> */}
        </div>
        {/* <RenderControls text={text} setText={setText} inputProps={inputProps} /> */}
        <Spacing />
        <Spacing />
        <Spacing />
        <Spacing />
        <Tips />
      </div>
    </div>
  );
};

export default Home;
