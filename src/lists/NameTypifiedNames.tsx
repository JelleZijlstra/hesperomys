import * as React from "react";

import { NameTypifiedNames_name } from "./__generated__/NameTypifiedNames_name.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";

class NameTypifiedNames extends React.Component<{
  name: NameTypifiedNames_name;
  title?: string;
  relay: RelayPaginationProp;
}> {
  render() {
    const { name, relay, title } = this.props;
    if (!name.typifiedNames || name.typifiedNames.edges.length === 0) {
      return null;
    }
    return (
      <>
        <h3>{title || "TypifiedNames"}</h3>
        <ul>
          {name.typifiedNames.edges.map(
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
  NameTypifiedNames,
  {
    name: graphql`
      fragment NameTypifiedNames_name on Name
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        typifiedNames(first: $count, after: $cursor)
          @connection(key: "NameTypifiedNames_typifiedNames") {
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
    getConnectionFromProps: (props) => props.name.typifiedNames,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.name.oid,
      };
    },
    query: graphql`
      query NameTypifiedNamesPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        name(oid: $oid) {
          ...NameTypifiedNames_name @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
