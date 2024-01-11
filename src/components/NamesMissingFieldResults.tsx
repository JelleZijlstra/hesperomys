import * as React from "react";

import { NamesMissingFieldResults_queryRoot } from "./__generated__/NamesMissingFieldResults_queryRoot.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import NameList from "./NameList";

interface NamesMissingFieldResultProps {
  queryRoot: NamesMissingFieldResults_queryRoot;
  field: string;
  oid: number;
  relay: RelayPaginationProp;
}

function NamesMissingFieldResults({ queryRoot, relay }: NamesMissingFieldResultProps) {
  const result = queryRoot.taxon?.namesMissingField;
  if (!result || result.edges.length === 0) {
    return <p>No names found</p>;
  }
  return (
    <>
      <NameList connection={result} />
      <LoadMoreButton numToLoad={100} relay={relay} />
    </>
  );
}

export default createPaginationContainer(
  NamesMissingFieldResults,
  {
    queryRoot: graphql`
      fragment NamesMissingFieldResults_queryRoot on QueryRoot
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 100 }
        cursor: { type: "String", defaultValue: null }
        field: { type: "String!" }
        oid: { type: "Int!" }
      ) {
        taxon(oid: $oid) {
          namesMissingField(field: $field, first: $count, after: $cursor)
            @connection(key: "NamesMissingFieldResults_namesMissingField") {
            ...NameList_connection
              @arguments(showCitationDetail: true, showNameDetail: true)
            edges {
              cursor
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps: (props) => props.queryRoot.taxon?.namesMissingField,
    getVariables({ field, oid }, { count, cursor }) {
      return { count, cursor, field, oid };
    },
    query: graphql`
      query NamesMissingFieldResultsQuery(
        $count: Int!
        $cursor: String
        $field: String!
        $oid: Int!
      ) {
        ...NamesMissingFieldResults_queryRoot
          @arguments(count: $count, cursor: $cursor, field: $field, oid: $oid)
      }
    `,
  },
);
