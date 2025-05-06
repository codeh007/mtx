import { makeProject } from "@revideo/core";
// import { exampleScene } from "./scenes/scene";
// import { scene1 } from "./scenes/scene1";
import { exampleScene } from "./scenes/scene";

// 提示: 在 linux 环境下,可能需要安装: sudo apt-get install nscd
export default makeProject({
  scenes: [
    // tweeningLinear,
    exampleScene,
    // exampleScene,
    // scene1,
  ],
});

/**
 * 

 */
