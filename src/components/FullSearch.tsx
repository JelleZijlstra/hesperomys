import React, { useState, useCallback } from "react";
import { QueryRenderer } from "react-relay";
import environment from "../relayEnvironment";
import graphql from "babel-plugin-relay/macro";

import { FullSearchQuery } from "./__generated__/FullSearchQuery.graphql";
import ModelLink from "./ModelLink";
import ReactMarkdown from "react-markdown";

function SingleResult({
  result,
}: {
  result: NonNullable<
    NonNullable<NonNullable<FullSearchQuery["response"]["search"]>["edges"][0]>["node"]
  >;
}) {
  return (
    <div>
      <hr />
      <p>
        {result.model && <ModelLink model={result.model} />}
        {result.context && <> ({result.context})</>}
      </p>
      {result.highlight && <ReactMarkdown children={result.highlight} />}
    </div>
  );
}

function SearchResults({ query }: { query: string }) {
  return (
    <QueryRenderer<FullSearchQuery>
      environment={environment}
      query={graphql`
        query FullSearchQuery($query: String!) {
          search(query: $query) {
            edges {
              cursor
              node {
                model {
                  ...ModelLink_model
                }
                context
                highlight
              }
            }
          }
        }
      `}
      variables={{ query }}
      render={({ error, props }) => {
        if (error) {
          return <div>Error!</div>;
        }
        if (!props) {
          return <div>Loading...</div>;
        }
        return props.search?.edges.map(
          (edge) =>
            edge?.node?.model && <SingleResult key={edge.cursor} result={edge.node} />,
        );
      }}
    />
  );
}

export default function FullSearch() {
  const [query, setQuery] = useState<string | null>(null);
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setQuery(e.target.query.value);
    },
    [setQuery],
  );
  return (
    <>
      <form method="post" onSubmit={handleSubmit}>
        <input name="query" />
        <button type="submit">Search</button>
      </form>
      {query && <SearchResults query={query} />}
    </>
  );
}
