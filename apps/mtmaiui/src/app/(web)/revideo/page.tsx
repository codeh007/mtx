"use client";

import { makeProject } from "@revideo/core";
import { PlayerV2 } from "../../../revedio/player_v2";
import exampleScene from "../../../revedio/scenes/scene";

// 提示: 在 linux 环境下,可能需要安装: sudo apt-get install nscd
const project = makeProject({
  scenes: [
    // tweeningLinear,
    exampleScene,
    // exampleScene,
    // scene1,
  ],
});
export function PlayerComponent() {
  return (
    <>
      <PlayerV2
        project={project}
        controls={true}
        variables={
          {
            // data: stargazerTimes.length > 0 ? stargazerTimes : undefined,
            // repoName: repoName ? repoName : undefined,
            // repoImage: repoImage ? repoImage : undefined,
          }
        }
      />
    </>
  );
}
export default function RevideoPage() {
  return <PlayerComponent />;
}
