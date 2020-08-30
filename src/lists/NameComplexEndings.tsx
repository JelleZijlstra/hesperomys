import * as React from "react";

import { NameComplexEndings_nameComplex } from "./__generated__/NameComplexEndings_nameComplex.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";

interface NameComplexEndingsProps {
  nameComplex: NameComplexEndings_nameComplex;
  title?: string;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
}

class NameComplexEndings extends React.Component<NameComplexEndingsProps> {
  render() {
    const { nameComplex, relay, numToLoad, hideTitle, title } = this.props;
    if (!nameComplex.endings || nameComplex.endings.edges.length === 0) {
      return null;
    }
    return (
      <>
        {!hideTitle && <h3>{title || "Endings"}</h3>}
        <ul>
          {nameComplex.endings.edges.map(
            (edge) =>
              edge &&
              edge.node && (
                <ModelListEntry key={edge.node.oid} model={edge.node} />
              )
          )}
        </ul>
        <LoadMoreButton numToLoad={numToLoad || 10} relay={relay} />
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
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        endings(first: $count, after: $cursor)
          @connection(key: "NameComplexEndings_endings") {
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
          ...NameComplexEndings_nameComplex
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
