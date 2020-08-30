import * as React from "react";

import { NameComplexNames_nameComplex } from "./__generated__/NameComplexNames_nameComplex.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import NameList from "../components/NameList";

interface NameComplexNamesProps {
  nameComplex: NameComplexNames_nameComplex;
  title?: string;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
}

class NameComplexNames extends React.Component<NameComplexNamesProps> {
  render() {
    const { nameComplex, relay, numToLoad, hideTitle, title } = this.props;
    if (!nameComplex.names || nameComplex.names.edges.length === 0) {
      return null;
    }
    return (
      <>
        {!hideTitle && <h3>{title || "Names"}</h3>}
        <NameList connection={nameComplex.names} />
        <LoadMoreButton numToLoad={numToLoad || 10} relay={relay} />
      </>
    );
  }
}

export default createPaginationContainer(
  NameComplexNames,
  {
    nameComplex: graphql`
      fragment NameComplexNames_nameComplex on NameComplex
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        names(first: $count, after: $cursor)
          @connection(key: "NameComplexNames_names") {
          edges {
            node {
              oid
            }
          }
          ...NameList_connection
        }
      }
    `,
  },
  {
    getConnectionFromProps: (props) => props.nameComplex.names,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.nameComplex.oid,
      };
    },
    query: graphql`
      query NameComplexNamesPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        nameComplex(oid: $oid) {
          ...NameComplexNames_nameComplex
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
