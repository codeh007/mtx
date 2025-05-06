"use client";

import { Player } from "@revideo/player-react";
import project from "../../revedio/project";

export function PlayerComponent() {
  return (
    <Player
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
  );
}
