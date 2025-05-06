"use client";

import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { parseStream } from "./parse";

function Button({
  children,
  loading,
  onClick,
}: {
  children: React.ReactNode;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="text-sm flex items-center gap-x-2 rounded-md p-2 bg-gray-200 text-gray-700 hover:bg-gray-300"
      onClick={() => onClick()}
      disabled={loading}
    >
      {loading && <LoaderCircle className="animate-spin h-4 w-4 text-gray-700" />}
      {children}
    </button>
  );
}

export function RenderComponent({
  stargazerTimes,
  repoName,
  repoImage,
}: {
  stargazerTimes: number[];
  repoName: string;
  repoImage: string | null | undefined;
}) {
  const [renderLoading, setRenderLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  /**
   * Render the video.
   */
  async function render() {
    setRenderLoading(true);
    const res = await fetch("/api/render", {
      method: "POST",
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        variables: {
          data: stargazerTimes.length ? stargazerTimes : undefined,
          repoName: repoName || undefined,
          repoImage: repoImage || undefined,
        },
        streamProgress: true,
      }),
    }).catch((e) => console.log(e));

    if (!res) {
      alert("Failed to render video.");
      return;
    }

    const downloadUrl = await parseStream(res.body!.getReader(), (p) => setProgress(p));
    setRenderLoading(false);
    setDownloadUrl(downloadUrl);
  }

  return (
    <div className="flex gap-x-4">
      {/* Progress bar */}
      <div className="text-sm flex-1 bg-gray-100 rounded-md overflow-hidden">
        <div
          className="text-gray-600 bg-gray-400 h-full flex items-center px-4 transition-all transition-200"
          style={{
            width: `${Math.round(progress * 100)}%`,
          }}
        >
          {Math.round(progress * 100)}%
        </div>
      </div>
      {downloadUrl ? (
        <a
          href={downloadUrl}
          download
          className="text-sm flex items-center gap-x-2 rounded-md p-2 bg-green-200 text-gray-700 hover:bg-gray-300"
        >
          Download video
        </a>
      ) : (
        <Button onClick={() => render()} loading={renderLoading}>
          Render video
        </Button>
      )}
    </div>
  );
}
