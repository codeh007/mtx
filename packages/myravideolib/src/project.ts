import { makeProject } from "@revideo/core";
// import exampleScene from "./scenes/scene";
import tweeningLinear from "./scenes/tweening-linear";

export default makeProject({
  scenes: [
    tweeningLinear,
    // exampleScene,
    // exampleScene,
    // scene1,
  ],
});
