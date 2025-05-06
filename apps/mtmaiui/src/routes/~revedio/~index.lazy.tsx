"use client";
import { createLazyFileRoute } from "@tanstack/react-router";

import { Button } from "mtxuilib/ui/button";
import { Suspense, lazy, useEffect, useState } from "react";
import { RenderComponent } from "./RenderComponent";
import { getGithubRepositoryInfo } from "./actions";

const LazyPlayer = lazy(() => import("./Player").then((mod) => ({ default: mod.PlayerComponent })));

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

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted) {
    return null;
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
                // loading={githubLoading}
                disabled={githubLoading}
                onClick={() => fetchInformation(repoName as `${string}/${string}`, key)}
              >
                Fetch information
              </Button>
            )}
          </div>
        </div>
        {needsKey && (
          <div>
            <div className="text-sm text-blue-600 mb-2">
              You hit the Github API rate-limit. Please provide your own key. Requests to Github are
              made directly and the key stays on your device.
            </div>
            <div className="flex gap-x-4 text-sm">
              <input
                className="flex-1 rounded-md p-2 bg-gray-200 focus:outline-none placeholder:text-gray-400"
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                value={key}
                onChange={(e) => setKey(e.target.value)}
              />
              <Button
                // loading={githubLoading}
                disabled={githubLoading}
                onClick={() => fetchInformation(repoName as `${string}/${string}`, key)}
              >
                Fetch information
              </Button>
            </div>
          </div>
        )}
        {error && <div className="text-sm text-red-600">{error}</div>}
        <div>
          <div className="rounded-lg overflow-hidden">
            {/* You can find the scene code inside revideo/src/scenes/example.tsx */}
            {/* <Player
              project={project}
              controls={true}
              variables={{
                data: stargazerTimes.length > 0 ? stargazerTimes : undefined,
                repoName: repoName ? repoName : undefined,
                repoImage: repoImage ? repoImage : undefined,
              }}
            /> */}
            <Suspense fallback={<div>Loading...</div>}>
              <LazyPlayer />
            </Suspense>
          </div>
        </div>
        <RenderComponent
          stargazerTimes={stargazerTimes}
          repoName={repoName}
          repoImage={repoImage}
        />
      </div>
    </>
  );
}

/**
 * 
 * 
 * "Error
    at U_ (https://mtmag.yuepa8.com/assets/~index.lazy-BvTKITr9.js:201:55612)
    at https://mtmag.yuepa8.com/assets/~index.lazy-BvTKITr9.js:201:55671"
 */
