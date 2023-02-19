import * as React from "react";

import { SearchResults_queryRoot } from "./__generated__/SearchResults_queryRoot.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import ModelLink from "./ModelLink";
import ReactMarkdown from "react-markdown";

function SingleResult({
  result,
}: {
  result: NonNullable<
    NonNullable<NonNullable<SearchResults_queryRoot["search"]>["edges"][0]>["node"]
  >;
}) {
  return (
    <div>
      <hr />
      <p>
        {result.model && (
          <>
            {result.model.modelCls.name}: <ModelLink model={result.model} />
          </>
        )}
        {result.context && <> ({result.context})</>}
      </p>
      {result.highlight && <ReactMarkdown children={result.highlight} />}
    </div>
  );
}

interface SearchResultProps {
  queryRoot: SearchResults_queryRoot;
  queryString: string;
  relay: RelayPaginationProp;
}

function SearchResults({ queryRoot, relay }: SearchResultProps) {
  const edges = queryRoot.search?.edges || [];
  return (
    <>
      {edges.length === 0 && <p>No results found</p>}
      {edges.map(
        (edge) =>
          edge?.node?.model && <SingleResult key={edge.cursor} result={edge.node} />,
      )}
      <LoadMoreButton numToLoad={10} relay={relay} />
    </>
  );
}

export default createPaginationContainer(
  SearchResults,
  {
    queryRoot: graphql`
      fragment SearchResults_queryRoot on QueryRoot
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "String", defaultValue: null }
        queryString: { type: "String!" }
      ) {
        search(query: $queryString, first: $count, after: $cursor)
          @connection(key: "SearchResults_search") {
          edges {
            cursor
            node {
              model {
                ...ModelLink_model
                modelCls {
                  name
                }
              }
              context
              highlight
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps: (props) => props.queryRoot.search,
    getVariables({ queryString }, { count, cursor }, fragmentVariables) {
      return { count, cursor, queryString };
    },
    query: graphql`
      query SearchResultsQuery($count: Int!, $cursor: String, $queryString: String!) {
        ...SearchResults_queryRoot
          @arguments(count: $count, cursor: $cursor, queryString: $queryString)
      }
    `,
  },
);
