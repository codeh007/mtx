"use client";
import { createLazyFileRoute } from "@tanstack/react-router";
// import project from "../../revedio/project";
import project from "mtravideolib/project";
import { Button } from "mtxuilib/ui/button";
import { useState } from "react";
import { PlayerV2 } from "../../components/revedio_player";
import { getGithubRepositoryInfo } from "./actions";

export const Route = createLazyFileRoute("/revedio/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [repoName, setRepoName] = useState<string>("");
  const [repoImage, setRepoImage] = useState<string | null>();
  const [stargazerTimes, setStargazerTimes] = useState<number[]>([]);

  const [githubLoading, setGithubLoading] = useState(false);
  const [needsKey, setNeedsKey] = useState(false);
  const [key, setKey] = useState("");
  const [error, setError] = useState<string | null>();
  /**
   * Get information about the repository from Github.
   */
  async function fetchInformation(repoName: `${string}/${string}`, key: string) {
    setGithubLoading(true);
    const response = await getGithubRepositoryInfo(repoName, key ?? undefined);
    setGithubLoading(false);

    if (response.status === "rate-limit") {
      setNeedsKey(true);
      return;
    }

    if (response.status === "error") {
      setError("Failed to fetch repository information from Github.");
      return;
    }

    setStargazerTimes(response.stargazerTimes);
    setRepoImage(response.repoImage);
  }

  return (
    <>
      <div className="m-auto p-12 max-w-7xl flex flex-col gap-y-4">
        <div>
          <div className="text-sm text-gray-700 mb-2">Repository</div>
          <div className="flex gap-x-4 text-sm">
            <input
              className="flex-1 rounded-md p-2 bg-gray-200 focus:outline-none placeholder:text-gray-400"
              placeholder="redotvideo/revideo"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
            />
            {!needsKey && (
              <Button
                disabled={githubLoading}
                onClick={() => fetchInformation(repoName as `${string}/${string}`, key)}
              >
                Fetch information
              </Button>
            )}
          </div>
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <div>
          <div className="rounded-lg overflow-hidden">
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
          </div>
        </div>
      </div>
    </>
  );
}
