"use client";
import { html } from "@codemirror/lang-html";
import { json } from "@codemirror/lang-json";
import { python } from "@codemirror/lang-python";
import { tokyoNightStorm } from "@uiw/codemirror-theme-tokyo-night-storm";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { cn } from "mtxuilib/lib/utils";

function getLanguageExtension(language: "python" | "json" | "html") {
  switch (language) {
    case "python":
      return python();
    case "json":
      return json();
    case "html":
      return html();
  }
}

type Props = {
  value: string;
  onChange?: (value: string) => void;
  language?: "python" | "json" | "html";
  readOnly?: boolean;
  minHeight?: string;
  maxHeight?: string;
  className?: string;
  fontSize?: number;
};

export function CodeEditor({
  value,
  onChange,
  minHeight,
  maxHeight,
  language,
  className,
  readOnly = false,
  fontSize = 12,
}: Props) {
  const extensions = language
    ? [getLanguageExtension(language), EditorView.lineWrapping]
    : [EditorView.lineWrapping];

  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      extensions={extensions}
      theme={tokyoNightStorm}
      minHeight={minHeight}
      maxHeight={maxHeight}
      readOnly={readOnly}
      className={cn("cursor-auto", className)}
      style={{
        fontSize: fontSize,
      }}
    />
  );
}
