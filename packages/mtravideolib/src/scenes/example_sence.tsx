/** @jsxImportSource @revideo/2d/lib */
import { type Rect, makeScene2D } from "@revideo/2d";
import { createRef } from "@revideo/core";
import { Logo } from "../common/logo";

export default makeScene2D("hello_scene", function* (view) {
  const rect = createRef<Rect>();

  view.add(
    <>
      <Logo text="Hello" />
    </>,
  );

  yield* rect().rotation(10, 1).to(-10, 1);
});
