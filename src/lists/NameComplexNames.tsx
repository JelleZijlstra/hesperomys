import * as React from "react";

import { NameComplexNames_nameComplex } from "./__generated__/NameComplexNames_nameComplex.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";

class NameComplexNames extends React.Component<{
  nameComplex: NameComplexNames_nameComplex;
  title?: string;
  relay: RelayPaginationProp;
}> {
  render() {
    const { nameComplex, relay, title } = this.props;
    if (!nameComplex.names || nameComplex.names.edges.length === 0) {
      return null;
    }
    return (
      <>
        <h3>{title || "Names"}</h3>
        <ul>
          {nameComplex.names.edges.map(
            (edge) =>
              edge &&
              edge.node && (
                <li key={edge.node.oid}>
                  <ModelLink model={edge.node} />
                </li>
              )
          )}
        </ul>
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
              ...ModelLink_model
            }
          }
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
