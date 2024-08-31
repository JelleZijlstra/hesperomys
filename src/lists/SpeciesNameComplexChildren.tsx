import * as React from "react";

import { SpeciesNameComplexChildren_speciesNameComplex } from "./__generated__/SpeciesNameComplexChildren_speciesNameComplex.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ExpandButtons from "../components/ExpandButtons";
import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";
import { Context } from "../components/ModelLink";
import { supportsChildren } from "../components/ModelChildList";

interface SpeciesNameComplexChildrenProps {
  speciesNameComplex: SpeciesNameComplexChildren_speciesNameComplex;
  title?: string;
  subtitle?: JSX.Element;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
  wrapperTitle?: string;
  context?: Context;
}

class SpeciesNameComplexChildren extends React.Component<
  SpeciesNameComplexChildrenProps,
  { expandAll: boolean }
> {
  constructor(props: SpeciesNameComplexChildrenProps) {
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
      wrapperTitle,
    } = this.props;
    const context = this.props.context || "SpeciesNameComplex";
    if (
      !speciesNameComplex.children ||
      speciesNameComplex.children.edges.length === 0
    ) {
      return null;
    }
    const showExpandAll = speciesNameComplex.children.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node),
    );
    const inner = (
      <>
        {!hideTitle && (
          <h3>
            {title || "Children"} ({speciesNameComplex.numChildren})
          </h3>
        )}
        {subtitle}
        <ExpandButtons
          expandAll={this.state.expandAll}
          setExpandAll={showExpandAll ? undefined : undefined}
        />
        <ul>
          {speciesNameComplex.children.edges.map(
            (edge) =>
              edge &&
              edge.node && (
                <ModelListEntry
                  key={edge.node.oid}
                  model={edge.node}
                  showChildren={this.state.expandAll}
                  context={context}
                />
              ),
          )}
        </ul>
        <LoadMoreButton numToLoad={numToLoad} relay={relay} />
      </>
    );
    if (wrapperTitle) {
      return (
        <div>
          <i>{wrapperTitle}</i>
          {inner}
        </div>
      );
    }
    return inner;
  }
}

export default createPaginationContainer(
  SpeciesNameComplexChildren,
  {
    speciesNameComplex: graphql`
      fragment SpeciesNameComplexChildren_speciesNameComplex on SpeciesNameComplex
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 50 }
        cursor: { type: "String", defaultValue: null }
      ) {
        oid
        numChildren
        children(first: $count, after: $cursor)
          @connection(key: "SpeciesNameComplexChildren_children") {
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
    getConnectionFromProps: (props) => props.speciesNameComplex.children,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.speciesNameComplex.oid,
      };
    },
    query: graphql`
      query SpeciesNameComplexChildrenPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        speciesNameComplex(oid: $oid) {
          ...SpeciesNameComplexChildren_speciesNameComplex
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  },
);
