import * as React from "react";

import { LocationTypeLocalities_location } from "./__generated__/LocationTypeLocalities_location.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import NameList from "../components/NameList";

interface LocationTypeLocalitiesProps {
  location: LocationTypeLocalities_location;
  title?: string;
  relay: RelayPaginationProp;
}

class LocationTypeLocalities extends React.Component<
  LocationTypeLocalitiesProps,
  { numToLoad: number | null }
> {
  constructor(props: LocationTypeLocalitiesProps) {
    super(props);
    this.state = { numToLoad: 10 };
  }

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
        <NameList connection={location.typeLocalities} />
        {relay.hasMore() && (
          <div>
            <button onClick={() => this._loadMore()}>Load</button>{" "}
            <input
              type="text"
              value={this.state.numToLoad || ""}
              onChange={(e) => {
                if (!e.target.value) {
                  this.setState({ numToLoad: null });
                  return;
                }
                const value = parseInt(e.target.value);
                if (!isNaN(value)) {
                  this.setState({ numToLoad: parseInt(e.target.value) });
                }
              }}
            />
            {" More"}
          </div>
        )}
      </>
    );
  }

  _loadMore() {
    const { relay } = this.props;
    if (!relay.hasMore() || relay.isLoading()) {
      return;
    }

    relay.loadMore(this.state.numToLoad || 10, (error) => {
      if (error) {
        console.log(error);
      }
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
            }
          }
          ...NameList_connection
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
