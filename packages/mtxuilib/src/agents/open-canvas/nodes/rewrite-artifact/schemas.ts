import { z } from "zod";
import { PROGRAMMING_LANGUAGES } from "../../../../agentutils/opencanvas_utils";

export const OPTIONALLY_UPDATE_ARTIFACT_META_SCHEMA = z.object({
  type: z.enum(["text", "code"]).describe("The type of the artifact content."),
  title: z
    .string()
    .optional()
    .describe(
      "The new title to give the artifact. ONLY update this if the user is making a request which changes the subject/topic of the artifact.",
    ),
  language: z
    .enum(
      PROGRAMMING_LANGUAGES.map((lang) => lang.language) as [
        string,
        ...string[],
      ],
    )
    .describe(
      "The language of the code artifact. This should be populated with the programming language if the user is requesting code to be written, or 'other', in all other cases.",
    ),
});
