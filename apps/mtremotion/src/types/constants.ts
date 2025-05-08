import { z } from "zod";
export const COMP_NAME = "MyComp";

export const MainSenceSchema = z.object({
  title: z.string(),
  speechUrl: z.string(),
  subScenes: z.array(
    z.object({
      title: z.string(),
      senceType: z.string(),
      duration: z.number(),
      image: z.string(),
    }),
  ),
});

export const defaultMyCompProps: z.infer<typeof MainSenceSchema> = {
  title: "Next.js and Remotion",
  subScenes: [],
  speechUrl: "",
};

export const DURATION_IN_FRAMES = 200;
export const VIDEO_WIDTH = 1280;
export const VIDEO_HEIGHT = 720;
export const VIDEO_FPS = 30;
