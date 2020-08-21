import * as React from "react";

import { LocationTypeLocalities_location } from "./__generated__/LocationTypeLocalities_location.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";

class LocationTypeLocalities extends React.Component<{
  location: LocationTypeLocalities_location;
  title?: string;
  relay: RelayPaginationProp;
}> {
  render() {
    const { location, relay, title } = this.props;
    if (
      !location.typeLocalities ||
      location.typeLocalities.edges.length === 0
    ) {
      return null;
    }
    return (
      <>
        <h3>{title || "TypeLocalities"}</h3>
        <ul>
          {location.typeLocalities.edges.map(
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
  LocationTypeLocalities,
  {
    location: graphql`
      fragment LocationTypeLocalities_location on Location
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        typeLocalities(first: $count, after: $cursor)
          @connection(key: "LocationTypeLocalities_typeLocalities") {
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
    getConnectionFromProps: (props) => props.location.typeLocalities,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.location.oid,
      };
    },
    query: graphql`
      query LocationTypeLocalitiesPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        location(oid: $oid) {
          ...LocationTypeLocalities_location
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
