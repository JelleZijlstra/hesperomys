import * as React from "react";

import { NameComplexEndings_nameComplex } from "./__generated__/NameComplexEndings_nameComplex.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";
import { supportsChildren } from "../components/ModelChildList";

interface NameComplexEndingsProps {
  nameComplex: NameComplexEndings_nameComplex;
  title?: string;
  subtitle?: JSX.Element;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
}

class NameComplexEndings extends React.Component<
  NameComplexEndingsProps,
  { expandAll: boolean }
> {
  constructor(props: NameComplexEndingsProps) {
    super(props);
    this.state = { expandAll: false };
  }

  render() {
    const { nameComplex, relay, numToLoad, hideTitle, title, subtitle } = this.props;
    if (!nameComplex.endings || nameComplex.endings.edges.length === 0) {
      return null;
    }
    const showExpandAll = nameComplex.endings.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node)
    );
    return (
      <>
        {!hideTitle && <h3>{title || "Endings"}</h3>}
        {subtitle}
        <ul>
          {nameComplex.endings.edges.map(
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
  NameComplexEndings,
  {
    nameComplex: graphql`
      fragment NameComplexEndings_nameComplex on NameComplex
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 50 }
        cursor: { type: "String", defaultValue: null }
      ) {
        oid
        endings(first: $count, after: $cursor)
          @connection(key: "NameComplexEndings_endings") {
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
    getConnectionFromProps: (props) => props.nameComplex.endings,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.nameComplex.oid,
      };
    },
    query: graphql`
      query NameComplexEndingsPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        nameComplex(oid: $oid) {
          ...NameComplexEndings_nameComplex @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
