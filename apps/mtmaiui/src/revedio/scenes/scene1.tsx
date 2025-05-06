import { Audio, Img, Video, makeScene2D } from "@revideo/2d";
import { all, chain, createRef, waitFor } from "@revideo/core";

export const scene1 = makeScene2D("scene1", function* (view) {
  const logoRef = createRef<Img>();

  yield view.add(
    <>
      {/* @ts-ignore */}
      <Video
        src={"https://revideo-example-assets.s3.amazonaws.com/stars.mp4"}
        play={true}
        size={["100%", "100%"]}
      />
      {/* @ts-ignore */}
      <Audio
        src={"https://revideo-example-assets.s3.amazonaws.com/chill-beat.mp3"}
        play={true}
        time={17.0}
      />
    </>,
  );

  yield* waitFor(1);

  view.add(
    // @ts-ignore
    <Img
      width={"1%"}
      ref={logoRef}
      src={"https://revideo-example-assets.s3.amazonaws.com/revideo-logo-white.png"}
    />,
  );

  yield* chain(all(logoRef().scale(40, 2), logoRef().rotation(360, 2)), logoRef().scale(60, 1));
});
