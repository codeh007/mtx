import { z } from "zod";

export const subsectionSchema = z.object({
    subsection_title: z.string().describe("Title of the subsection"),
    description: z.string().describe("Content of the subsection"),
  });
  
  export const sectionSchema = z.object({
    section_title: z.string().describe("Title of the section"),
    description: z.string().describe("Content of the section"),
    subsections: z.array(subsectionSchema).describe("Titles and descriptions for each subsection of the Wikipedia page."),
  });
  
  export const outlineSchema = z.object({
    page_title: z.string().describe("Title of the Wikipedia page"),
    sections: z.array(sectionSchema).describe("Titles and descriptions for each section of the Wikipedia page."),
  });
  
  export const editorSchema = z.object({
    affiliation: z.string().describe("Primary affiliation of the editor."),
    name: z.string().describe("Name of the editor."),
    role: z.string().describe("Role of the editor in the context of the topic."),
    description: z.string().describe("Description of the editor's focus, concerns, and motives."),
  });

  type Editor = z.infer<typeof editorSchema>
  export const perspectivesSchema = z.object({
    editors: z.array(editorSchema).describe("Comprehensive list of editors with their roles and affiliations."),
  });
  