import React, { useState, useCallback } from "react";
import { QueryRenderer } from "react-relay";
import environment from "../relayEnvironment";
import graphql from "babel-plugin-relay/macro";

import { FullSearchQuery } from "./__generated__/FullSearchQuery.graphql";
import SearchResults from "./SearchResults";

function SearchResultsRenderer({ queryString }: { queryString: string }) {
  return (
    <QueryRenderer<FullSearchQuery>
      environment={environment}
      query={graphql`
        query FullSearchQuery($queryString: String!) {
          ...SearchResults_query @arguments(queryString: $queryString)
        }
      `}
      variables={{ queryString }}
      render={({ error, props }) => {
        if (error) {
          return <div>Error!</div>;
        }
        if (!props) {
          return <div>Loading...</div>;
        }
        return <SearchResults query={props} queryString={queryString} />;
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
      {query && <SearchResultsRenderer queryString={query} />}
    </>
  );
}
