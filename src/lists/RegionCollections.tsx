import * as React from "react";

import { RegionCollections_region } from "./__generated__/RegionCollections_region.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";

class RegionCollections extends React.Component<{
  region: RegionCollections_region;
  title?: string;
  relay: RelayPaginationProp;
}> {
  render() {
    const { region, relay, title } = this.props;
    if (!region.collections || region.collections.edges.length === 0) {
      return null;
    }
    return (
      <>
        <h3>{title || "Collections"}</h3>
        <ul>
          {region.collections.edges.map(
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
  RegionCollections,
  {
    region: graphql`
      fragment RegionCollections_region on Region
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        collections(first: $count, after: $cursor)
          @connection(key: "RegionCollections_collections") {
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
    getConnectionFromProps: (props) => props.region.collections,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.region.oid,
      };
    },
    query: graphql`
      query RegionCollectionsPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        region(oid: $oid) {
          ...RegionCollections_region @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
