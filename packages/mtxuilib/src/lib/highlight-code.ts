"use server";

import { promises as fs } from "node:fs";
import path from "node:path";
import { getHighlighter } from "shiki";

export async function highlightCode(code: string) {
  // Highlighting is failing in server components.
  // Disabling this in development.
  // TODO: Remove this when we figure out the issue.
  if (process.env.NODE_ENV === "development") {
    return code;
  }

  const editorTheme = await fs.readFile(
    path.join(process.cwd(), "lib/themes/dark.json"),
    "utf-8",
  );

  const highlighter = await getHighlighter({
    langs: ["typescript"],
    themes: [],
  });

  await highlighter.loadTheme(JSON.parse(editorTheme));

  const html = await highlighter.codeToHtml(code, {
    lang: "typescript",
    theme: "Lambda Studio — Blackout",
  });

  return html;
}
