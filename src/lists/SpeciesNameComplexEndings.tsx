import * as React from "react";

import { SpeciesNameComplexEndings_speciesNameComplex } from "./__generated__/SpeciesNameComplexEndings_speciesNameComplex.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";
import { supportsChildren } from "../components/ModelChildList";

interface SpeciesNameComplexEndingsProps {
  speciesNameComplex: SpeciesNameComplexEndings_speciesNameComplex;
  title?: string;
  subtitle?: JSX.Element;
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
      subtitle,
    } = this.props;
    if (
      !speciesNameComplex.endings ||
      speciesNameComplex.endings.edges.length === 0
    ) {
      return null;
    }
    const showExpandAll = speciesNameComplex.endings.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node)
    );
    return (
      <>
        {!hideTitle && <h3>{title || "Endings"}</h3>}
        {subtitle}
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
          numToLoad={numToLoad || 100}
          relay={relay}
          expandAll={this.state.expandAll}
          setExpandAll={showExpandAll ? undefined : undefined}
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
              __typename
              ...ModelListEntry_model
              ...ModelChildList_model @relay(mask: false)
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
