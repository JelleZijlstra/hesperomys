import React from "react";
import ReactMarkdown from "react-markdown";

const InlineMarkdown = ({ source }: { source: string }) => (
  <span className="inline-markdown">
    <ReactMarkdown children={source} />
  </span>
);

export default InlineMarkdown;
