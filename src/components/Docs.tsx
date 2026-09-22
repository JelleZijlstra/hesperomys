import React from "react";
import { QueryRenderer } from "react-relay";
import environment from "../relayEnvironment";
import ReactMarkdown, { uriTransformer } from "react-markdown";
import remarkGfm from "remark-gfm";
import graphql from "babel-plugin-relay/macro";

import PageStatus from "./PageStatus";
import SiteHeader from "./SiteHeader";
import SiteBody from "./SiteBody";
import { getDocumentationAssetUrl } from "./documentationUrl";

import { DocsQuery } from "./__generated__/DocsQuery.graphql";

export default function Docs({ path }: { path: string }) {
  return (
    <QueryRenderer<DocsQuery>
      environment={environment}
      query={graphql`
        query DocsQuery($path: String!) {
          documentation(path: $path)
        }
      `}
      variables={{ path }}
      render={({ error, props, retry }) => {
        if (error) {
          return <PageStatus kind="error" onRetry={retry} />;
        }
        if (!props) {
          return <div className="route-loading">Loading...</div>;
        }
        if (!props.documentation) {
          return <PageStatus kind="not-found" />;
        }
        return (
          <>
            <SiteHeader>
              <>Documentation</>
            </SiteHeader>
            <SiteBody>
              <ReactMarkdown
                className="documentation"
                remarkPlugins={[remarkGfm]}
                transformLinkUri={(uri) =>
                  getDocumentationAssetUrl(uriTransformer(uri), path)
                }
                transformImageUri={(uri) =>
                  getDocumentationAssetUrl(uriTransformer(uri), path)
                }
                components={{
                  table: ({ children }) => (
                    <div
                      className="markdown-table"
                      tabIndex={0}
                      role="region"
                      aria-label="Table"
                    >
                      <table className="bordered">{children}</table>
                    </div>
                  ),
                }}
              >
                {props.documentation}
              </ReactMarkdown>
            </SiteBody>
          </>
        );
      }}
    />
  );
}
