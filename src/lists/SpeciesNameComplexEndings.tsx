import * as React from "react";

import { SpeciesNameComplexEndings_speciesNameComplex } from "./__generated__/SpeciesNameComplexEndings_speciesNameComplex.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";

interface SpeciesNameComplexEndingsProps {
  speciesNameComplex: SpeciesNameComplexEndings_speciesNameComplex;
  title?: string;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
}

class SpeciesNameComplexEndings extends React.Component<
  SpeciesNameComplexEndingsProps,
  { expandAll: boolean }
> {
  constructor(props: SpeciesNameComplexEndingsProps) {
    super(props);
    this.state = { expandAll: false };
  }

  render() {
    const {
      speciesNameComplex,
      relay,
      numToLoad,
      hideTitle,
      title,
    } = this.props;
    if (
      !speciesNameComplex.endings ||
      speciesNameComplex.endings.edges.length === 0
    ) {
      return null;
    }
    return (
      <>
        {!hideTitle && <h3>{title || "Endings"}</h3>}
        <ul>
          {speciesNameComplex.endings.edges.map(
            (edge) =>
              edge &&
              edge.node && (
                <ModelListEntry
                  key={edge.node.oid}
                  model={edge.node}
                  showChildren={this.state.expandAll}
                />
              )
          )}
        </ul>
        <LoadMoreButton
          numToLoad={numToLoad || 10}
          relay={relay}
          expandAll={this.state.expandAll}
          setExpandAll={undefined}
        />
      </>
    );
  }
}

export default createPaginationContainer(
  SpeciesNameComplexEndings,
  {
    speciesNameComplex: graphql`
      fragment SpeciesNameComplexEndings_speciesNameComplex on SpeciesNameComplex
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        endings(first: $count, after: $cursor)
          @connection(key: "SpeciesNameComplexEndings_endings") {
          edges {
            node {
              oid
              ...ModelListEntry_model
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps: (props) => props.speciesNameComplex.endings,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.speciesNameComplex.oid,
      };
    },
    query: graphql`
      query SpeciesNameComplexEndingsPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        speciesNameComplex(oid: $oid) {
          ...SpeciesNameComplexEndings_speciesNameComplex
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
