import * as React from "react";

import { SpeciesNameComplexNames_speciesNameComplex } from "./__generated__/SpeciesNameComplexNames_speciesNameComplex.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import NameList from "../components/NameList";

class SpeciesNameComplexNames extends React.Component<{
  speciesNameComplex: SpeciesNameComplexNames_speciesNameComplex;
  title?: string;
  relay: RelayPaginationProp;
}> {
  render() {
    const { speciesNameComplex, relay, title } = this.props;
    if (
      !speciesNameComplex.names ||
      speciesNameComplex.names.edges.length === 0
    ) {
      return null;
    }
    return (
      <>
        <h3>{title || "Names"}</h3>
        <NameList connection={speciesNameComplex.names} />
        {relay.hasMore() && (
          <button onClick={() => this._loadMore()}>Load More</button>
        )}
      </>
    );
  }

  _loadMore() {
    const { relay } = this.props;
    if (!relay.hasMore() || relay.isLoading()) {
      return;
    }

    relay.loadMore(10, (error) => {
      console.log(error);
    });
  }
}

export default createPaginationContainer(
  SpeciesNameComplexNames,
  {
    speciesNameComplex: graphql`
      fragment SpeciesNameComplexNames_speciesNameComplex on SpeciesNameComplex
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        names(first: $count, after: $cursor)
          @connection(key: "SpeciesNameComplexNames_names") {
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
    getConnectionFromProps: (props) => props.speciesNameComplex.names,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.speciesNameComplex.oid,
      };
    },
    query: graphql`
      query SpeciesNameComplexNamesPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        speciesNameComplex(oid: $oid) {
          ...SpeciesNameComplexNames_speciesNameComplex
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
