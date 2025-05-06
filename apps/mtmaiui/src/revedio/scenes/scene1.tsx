/** @jsxImportSource @revideo/2d/lib */
import { Audio, Img, Video, makeScene2D } from "@revideo/2d";
import { all, chain, createRef, waitFor } from "@revideo/core";

export const scene1 = makeScene2D("scene1", function* (view) {
  const logoRef = createRef<Img>();

  yield view.add(
    <>
      <Video
        src={"https://revideo-example-assets.s3.amazonaws.com/stars.mp4"}
        play={true}
        size={["100%", "100%"]}
      />
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

/**
 * 
 * "Error
    at makeScene2D (webpack-internal:///(app-pages-browser)/../../node_modules/@revideo/2d/lib/scenes/makeScene2D.js:12:16)
    at eval (webpack-internal:///(app-pages-browser)/./src/revedio/scenes/tweening-linear.tsx:15:122)
    at (app-pages-browser)/./src/revedio/scenes/tweening-linear.tsx (http://localhost:3600/_next/static/chunks/_app-pages-browser_src_routes_revedio_index_lazy_tsx.2f4b2c6388f123c3.js:1435:1)
    at options.factory (http://localhost:3600/_next/static/chunks/webpack.js?v=1746514124417:858:31)
    at __webpack_require__ (http://localhost:3600/_next/static/chunks/webpack.js?v=1746514124417:37:33)
    at fn (http://localhost:3600/_next/static/chunks/webpack.js?v=1746514124417:515:21)
    at eval (webpack-internal:///(app-pages-browser)/./src/revedio/project.ts:6:81)
    at (app-pages-browser)/./src/revedio/project.ts (http://localhost:3600/_next/static/chunks/_app-pages-browser_src_routes_revedio_index_lazy_tsx.2f4b2c6388f123c3.js:1424:1)
    at options.factory (http://localhost:3600/_next/static/chunks/webpack.js?v=1746514124417:858:31)
    at __webpack_require__ (http://localhost:3600/_next/static/chunks/webpack.js?v=1746514124417:37:33)
    at fn (http://localhost:3600/_next/static/chunks/webpack.js?v=1746514124417:515:21)
    at eval (webpack-internal:///(app-pages-browser)/./src/routes/~revedio/~index.lazy.tsx:11:74)
    at (app-pages-browser)/./src/routes/~revedio/~index.lazy.tsx (http://localhost:3600/_next/static/chunks/_app-pages-browser_src_routes_revedio_index_lazy_tsx.2f4b2c6388f123c3.js:1479:1)
    at options.factory (http://localhost:3600/_next/static/chunks/webpack.js?v=1746514124417:858:31)
    at __webpack_require__ (http://localhost:3600/_next/static/chunks/webpack.js?v=1746514124417:37:33)
    at fn (http://localhost:3600/_next/static/chunks/webpack.js?v=1746514124417:515:21)"
 */
