import * as React from "react";

import { SearchResults_query } from "./__generated__/SearchResults_query.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import ModelLink from "./ModelLink";
import ReactMarkdown from "react-markdown";

function SingleResult({
  result,
}: {
  result: NonNullable<
    NonNullable<NonNullable<SearchResults_query["search"]>["edges"][0]>["node"]
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
  query: SearchResults_query;
  queryString: string;
  relay: RelayPaginationProp;
}

function SearchResults({ query, relay }: SearchResultProps) {
  return (
    <>
      {query.search?.edges.map(
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
    query: graphql`
      fragment SearchResults_query on Query
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
    getConnectionFromProps: (props) => props.query.search,
    getVariables({ queryString }, { count, cursor }, fragmentVariables) {
      return { count, cursor, queryString };
    },
    query: graphql`
      query SearchResultsQuery($count: Int!, $cursor: String, $queryString: String!) {
        ...SearchResults_query
          @arguments(count: $count, cursor: $cursor, queryString: $queryString)
      }
    `,
  },
);
