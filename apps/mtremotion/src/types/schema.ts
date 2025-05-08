import { z } from "zod";
// export const COMP_NAME = "MyComp";

export const SceneSchema = z.object({
  title: z.string(),
  senceType: z.string(),
  duration: z.number(),
  image: z.string(),
});

export const SubtitleSchema = z.object({
  text: z.string(),
  start: z.number(),
  end: z.number(),
});

export const MainSenceSchema = z.object({
  title: z.string(),
  speechUrl: z.string().optional(),
  bgmUrl: z.string().optional(),
  // 字幕
  subtitles: z.array(SubtitleSchema).optional(),
  // 场景
  subScenes: z.array(SceneSchema),
  fps: z.number().default(30),
  width: z.number().default(1920),
  height: z.number().default(1080),
});

export const defaultMyCompProps: z.infer<typeof MainSenceSchema> = {
  title: "Next.js and Remotion",
  subScenes: [],
};

export const RenderRequest = z.object({
  id: z.string(),
  inputProps: MainSenceSchema,
});

export const ProgressRequest = z.object({
  bucketName: z.string(),
  id: z.string(),
});

export type ProgressResponse =
  | {
      type: "error";
      message: string;
    }
  | {
      type: "progress";
      progress: number;
    }
  | {
      type: "done";
      url: string;
      size: number;
    };
