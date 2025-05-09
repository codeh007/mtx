"use client";
import type { Player as CorePlayer, Project } from "@revideo/core";
import type { ComponentProps } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Controls } from "./controls";
import { shouldShowControls } from "./utils";

interface RevideoPlayerProps {
  playing?: string;
  variables?: string;
  looping?: string;
  width?: number;
  height?: number;
  quality?: number;
  fps?: number;
  volume?: number;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // eslint-disable-next-line
      "revideo-player": RevideoPlayerProps & ComponentProps<"div">;
    }
  }
}

interface PlayerProps {
  project: Project;
  controls?: boolean;
  variables?: Record<string, any>;
  playing?: boolean;
  currentTime?: number;
  volume?: number;
  looping?: boolean;
  fps?: number;

  width?: number;
  height?: number;
  quality?: number;
  timeDisplayFormat?: "MM:SS" | "MM:SS.mm" | "MM:SS.m";

  onDurationChange?: (duration: number) => void;
  onTimeUpdate?: (currentTime: number) => void;
  onPlayerReady?: (player: CorePlayer) => void;
  onPlayerResize?: (rect: DOMRectReadOnly) => void;
}

export function PlayerV2({
  project,
  controls = true,
  variables = {},
  playing = false,
  currentTime = 0,
  volume = 1,
  looping = true,
  fps = 30,

  width = undefined,
  height = undefined,
  quality = undefined,
  timeDisplayFormat = "MM:SS",

  onDurationChange = () => {},
  onTimeUpdate = () => {},
  onPlayerReady = () => {},
  onPlayerResize = () => {},
}: PlayerProps) {
  const [playingState, setPlaying] = useState(playing);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [currentTimeState, setCurrentTime] = useState(currentTime);
  const [volumeState, setVolumeState] = useState(volume);
  const [duration, setDuration] = useState(-1);

  const focus = useRef(false);
  const playerRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const lastRect = useRef<DOMRectReadOnly | null>(null);

  const onClickHandler = controls
    ? () => {
        setPlaying((prev) => !prev);
      }
    : undefined;

  /**
   * Sync the playing prop with the player's own state when it changes.
   */
  useEffect(() => {
    setPlaying(playing);
  }, [playing]);

  // 通过事件,控制 播放器
  useEffect(() => {
    // console.log("useEffect playingState", playingState);
    if (playerRef.current) {
      if (!playingState) {
        playerRef.current?.dispatchEvent(new CustomEvent("pause"));
      } else {
        playerRef.current?.dispatchEvent(new CustomEvent("play"));
      }
    }
  }, [playingState]);

  /**
   * When the forced time changes, seek to that time.
   */
  function setForcedTime(forcedTime: number) {
    // console.log("setForcedTime", forcedTime);
    if (playerRef.current) {
      playerRef.current.dispatchEvent(new CustomEvent("seekto", { detail: forcedTime }));
    }
  }

  function setForcedVolume(volume: number) {
    setVolumeState(volume);
    if (playerRef.current) {
      playerRef.current.dispatchEvent(new CustomEvent("volumechange", { detail: volume }));
    }
  }

  /**
   * Sync the current time with the player's own state.
   */

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const diff = Math.abs(currentTime - currentTimeState);
    if (diff > 0.05) {
      setForcedTime(currentTime);
    }
  }, [currentTime]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setForcedVolume(volume);
  }, [volume]);

  /**
   * Receives the current time of the video from the player.
   */
  const handleTimeUpdate = (event: Event) => {
    const e = event as CustomEvent;
    setCurrentTime(e.detail);
    onTimeUpdate(e.detail);
  };

  /**
   * Receives the duration of the video from the player.
   */
  const handleDurationUpdate = (event: Event) => {
    const e = event as CustomEvent;
    setDuration(e.detail);
    onDurationChange(e.detail);
  };

  /**
   * Play and pause using the space key.
   */
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.code === "Space" && focus.current) {
      event.preventDefault();
      setPlaying((prev) => !prev);
    }
  };

  const handlePlayerReady = (event: Event) => {
    const player = (event as CustomEvent).detail;
    if (player) {
      onPlayerReady(player);
    }
  };

  const handlePlayerResize = useCallback(
    (entries: ResizeObserverEntry[]) => {
      const [firstEntry] = entries;
      if (!firstEntry || !wrapperRef.current) {
        return;
      }

      const newRect = wrapperRef.current.getBoundingClientRect();
      if (
        !lastRect.current ||
        newRect.width !== lastRect.current.width ||
        newRect.height !== lastRect.current.height ||
        newRect.x !== lastRect.current.x ||
        newRect.y !== lastRect.current.y
      ) {
        lastRect.current = newRect;
        onPlayerResize(newRect);
      }
    },
    [onPlayerResize],
  );

  useEffect(() => {
    if (!wrapperRef.current) return;

    const resizeObserver = new ResizeObserver(handlePlayerResize);
    resizeObserver.observe(wrapperRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [handlePlayerResize]);

  /**
   * Import the player and add all event listeners.
   */

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    import("./internal").then(() => {
      if (playerRef.current) {
        console.log("playerRef", playerRef.current, project);
        (playerRef.current as any).setProject(project);
        setPlaying(true);
      }
    });

    playerRef.current?.addEventListener("timeupdate", handleTimeUpdate);
    playerRef.current?.addEventListener("duration", handleDurationUpdate);
    playerRef.current?.addEventListener("playerready", handlePlayerReady);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      playerRef.current?.removeEventListener("timeupdate", handleTimeUpdate);
      playerRef.current?.removeEventListener("duration", handleDurationUpdate);
      playerRef.current?.removeEventListener("playerready", handlePlayerReady);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, playerRef.current]);

  return (
    <div className="revideo-player-root" style={{ display: "contents" }}>
      <div
        ref={wrapperRef}
        className="relative cursor-default focus:outline-none"
        onFocus={() => {
          focus.current = true;
          // console.log("onFocus");
        }}
        onBlur={() => {
          focus.current = false;
          // console.log("onBlur");
        }}
        // tabIndex={0}
        onMouseEnter={() => setIsMouseOver(true)}
        onMouseLeave={() => setIsMouseOver(false)}
      >
        <div className="relative">
          {/* @ts-ignore */}
          <revideo-player
            ref={playerRef}
            // 这里的 playing 没有发挥作用
            playing={String(playingState)}
            //@ts-ignore
            onClick={onClickHandler}
            variables={JSON.stringify(variables)}
            //@ts-ignore
            looping={looping ? "true" : "false"}
            width={width}
            height={height}
            quality={quality}
            fps={fps}
            volume={volumeState}
          />

          <div
            className={`absolute bottom-0 w-full transition-opacity duration-200 ${
              shouldShowControls(playingState, isMouseOver, !controls) ? "opacity-100" : "opacity-0"
            }`}
          >
            <Controls
              duration={duration}
              playing={playingState}
              setPlaying={setPlaying}
              currentTime={currentTimeState}
              setForcedTime={setForcedTime}
              timeDisplayFormat={timeDisplayFormat}
              volume={volumeState}
              setVolume={setForcedVolume}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
