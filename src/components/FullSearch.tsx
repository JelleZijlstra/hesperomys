import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import LoadError from "./LoadError";
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
          ...SearchResults_queryRoot @arguments(queryString: $queryString)
        }
      `}
      variables={{ queryString }}
      render={({ error, props, retry }) => {
        if (error) {
          return (
            <LoadError message="Search results could not be loaded." onRetry={retry} />
          );
        }
        if (!props) {
          return <div>Loading...</div>;
        }
        return <SearchResults queryRoot={props} queryString={queryString} />;
      }}
    />
  );
}

export default function FullSearch() {
  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";
  const [input, setInput] = useState(query);
  useEffect(() => setInput(query), [query]);
  return (
    <>
      <form
        method="get"
        onSubmit={(event) => {
          event.preventDefault();
          const params = new URLSearchParams(location.search);
          const nextQuery = input.trim();
          if (nextQuery) params.set("q", nextQuery);
          else params.delete("q");
          const search = params.toString();
          history.push({
            pathname: location.pathname,
            search: search ? `?${search}` : "",
          });
          setInput(nextQuery);
        }}
      >
        <label htmlFor="article-search-query">Search article full text</label>{" "}
        <input
          id="article-search-query"
          name="q"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      {query && <SearchResultsRenderer key={query} queryString={query} />}
    </>
  );
}
