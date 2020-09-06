import React from "react";
import { QueryRenderer } from "react-relay";
import environment from "../relayEnvironment";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import graphql from "babel-plugin-relay/macro";

import { DocsQuery } from "./__generated__/DocsQuery.graphql";

import SiteHeader from "./SiteHeader";

export default function Docs() {
  const { path } = useParams();
  return (
    <QueryRenderer<DocsQuery>
      environment={environment}
      query={graphql`
        query DocsQuery($path: String!) {
          documentation(path: $path)
        }
      `}
      variables={{ path }}
      render={({ error, props }) => {
        if (error) {
          return <div>Error!</div>;
        }
        if (!props) {
          return <div>Loading...</div>;
        }
        if (!props.documentation) {
          return <div>Not found</div>;
        }
        return (
          <>
            <SiteHeader>
              <>Documentation</>
            </SiteHeader>
            <ReactMarkdown source={props.documentation} />
          </>
        );
      }}
    />
  );
}
