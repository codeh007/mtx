import { makeProject } from "@revideo/core";
import { scene1 } from "./scenes/scene1";

// 提示: 在 linux 环境下,可能需要安装: sudo apt-get install nscd
export default makeProject({
  scenes: [scene1],
});
