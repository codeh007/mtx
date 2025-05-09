/** @jsxImportSource @revideo/2d/lib */
import { Circle, makeScene2D } from "@revideo/2d";
import { all, createRef } from "@revideo/core";

export default makeScene2D("quickstart", function* (view) {
  const myCircle = createRef<Circle>();

  view.add(
    <Circle
      //highlight-start
      ref={myCircle}
      x={-300}
      width={140}
      height={140}
      fill="#413238"
    />,
  );

  yield* all(
    myCircle().position.x(300, 1).to(-300, 1),
    myCircle().fill("#e6a700", 1).to("#e13238", 1),
  );
});
