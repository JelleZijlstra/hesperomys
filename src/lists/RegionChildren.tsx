import * as React from "react";

import { RegionChildren_region } from "./__generated__/RegionChildren_region.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";

class RegionChildren extends React.Component<{
  region: RegionChildren_region;
  title?: string;
  relay: RelayPaginationProp;
}> {
  render() {
    const { region, relay, title } = this.props;
    if (!region.children || region.children.edges.length === 0) {
      return null;
    }
    return (
      <>
        <h3>{title || "Children"}</h3>
        <ul>
          {region.children.edges.map(
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
  RegionChildren,
  {
    region: graphql`
      fragment RegionChildren_region on Region
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        children(first: $count, after: $cursor)
          @connection(key: "RegionChildren_children") {
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
    getConnectionFromProps: (props) => props.region.children,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.region.oid,
      };
    },
    query: graphql`
      query RegionChildrenPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        region(oid: $oid) {
          ...RegionChildren_region @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
