import React from "react";
import ReactMarkdown from "react-markdown";

function escapeListMarkers(text: string): string {
  // Escape ordered list markers like "1. " at start of line
  let out = text.replace(
    /(^|\n)([ \t]*)(\d+)\.\s/g,
    (_m, p1, p2, p3) => `${p1}${p2}${p3}\\. `,
  );
  // Escape unordered list markers like "- ", "+ ", "* " at start of line
  out = out.replace(
    /(^|\n)([ \t]*)([-+*])\s/g,
    (_m, p1, p2, p3) => `${p1}${p2}\\${p3} `,
  );
  return out;
}

const InlineMarkdown = ({ source }: { source: string }) => {
  const escaped = escapeListMarkers(source);
  return (
    <span className="inline-markdown">
      <ReactMarkdown components={{ p: ({ children }) => <>{children}</> }}>
        {escaped}
      </ReactMarkdown>
    </span>
  );
};

export default InlineMarkdown;
