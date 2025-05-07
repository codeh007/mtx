import { makeProject } from "@revideo/core";
import exampleScene from "./scenes/example_sence";
import helloScene from "./scenes/hello_scene";
// import exampleScene from "./scenes/scene";
import tweeningLinear from "./scenes/tweening-linear";
export default makeProject({
  scenes: [
    tweeningLinear,
    helloScene,
    exampleScene,
    // exampleScene,
    // exampleScene,
    // scene1,
  ],
});
