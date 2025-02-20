import { Copy } from "lucide-react";
import type React from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import js from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import type { Guide } from "../types";
import DockerGuide from "./docker";
import PythonGuide from "./python";

import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

SyntaxHighlighter.registerLanguage("javascript", js);
SyntaxHighlighter.registerLanguage("python", python);

interface GuideContentProps {
  guide: Guide;
}

export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};
export const GuideContent: React.FC<GuideContentProps> = ({ guide }) => {
  // Render different content based on guide type and id
  switch (guide.id) {
    case "python-setup":
      return <PythonGuide />;

    case "docker-setup":
      return <DockerGuide />;

    // Add more cases for other guides...

    default:
      return (
        <div className=" ">
          A Guide with the title <strong>{guide.title}</strong> is work in
          progress!
        </div>
      );
  }
};

interface CodeSectionProps {
  title: string;
  description?: string | React.ReactNode;
  code?: string;
  onCopy: (text: string) => void;
  language?: string;
}

export const CodeSection: React.FC<CodeSectionProps> = ({
  title,
  description,
  code,
  onCopy,
  language = "python",
}) => (
  <section className="mt-6 bg-seco">
    <h2 className="text-md font-semibold mb-3">{title}</h2>
    {description && <p className="  mb-3">{description}</p>}
    {code && (
      <div className="relative bg-secondary text-sm p-4 rounded overflow-auto scroll">
        <button
          onClick={() => onCopy(code)}
          className="absolute right-2 top-2 p-2  bg-secondary hover:bg-primary rounded-md"
        >
          <Copy className="size-4 hover:text-accent transition duration-100" />
        </button>
        {/* overflow scroll custom style */}
        <SyntaxHighlighter language={language} wrapLines={true} style={oneDark}>
          {code}
        </SyntaxHighlighter>
      </div>
    )}
  </section>
);

export default GuideContent;
