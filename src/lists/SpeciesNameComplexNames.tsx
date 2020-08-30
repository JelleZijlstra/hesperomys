import * as React from "react";

import { SpeciesNameComplexNames_speciesNameComplex } from "./__generated__/SpeciesNameComplexNames_speciesNameComplex.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import NameList from "../components/NameList";

interface SpeciesNameComplexNamesProps {
  speciesNameComplex: SpeciesNameComplexNames_speciesNameComplex;
  title?: string;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
}

class SpeciesNameComplexNames extends React.Component<
  SpeciesNameComplexNamesProps
> {
  render() {
    const {
      speciesNameComplex,
      relay,
      numToLoad,
      hideTitle,
      title,
    } = this.props;
    if (
      !speciesNameComplex.names ||
      speciesNameComplex.names.edges.length === 0
    ) {
      return null;
    }
    return (
      <>
        {!hideTitle && <h3>{title || "Names"}</h3>}
        <NameList connection={speciesNameComplex.names} />
        <LoadMoreButton numToLoad={numToLoad || 10} relay={relay} />
      </>
    );
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
