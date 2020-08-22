import * as React from "react";

import { RegionLocations_region } from "./__generated__/RegionLocations_region.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";

interface RegionLocationsProps {
  region: RegionLocations_region;
  title?: string;
  relay: RelayPaginationProp;
}

class RegionLocations extends React.Component<
  RegionLocationsProps,
  { numToLoad: number }
> {
  constructor(props: RegionLocationsProps) {
    super(props);
    this.state = { numToLoad: 10 };
  }

  render() {
    const { region, relay, title } = this.props;
    if (!region.locations || region.locations.edges.length === 0) {
      return null;
    }
    return (
      <>
        <h3>{title || "Locations"}</h3>
        <ul>
          {region.locations.edges.map(
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
          <div>
            <button onClick={() => this._loadMore()}>Load</button>{" "}
            <input
              type="text"
              value={this.state.numToLoad}
              onChange={(e) => {
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

    relay.loadMore(this.state.numToLoad, (error) => {
      if (error) {
        console.log(error);
      }
    });
  }
}

export default createPaginationContainer(
  RegionLocations,
  {
    region: graphql`
      fragment RegionLocations_region on Region
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        locations(first: $count, after: $cursor)
          @connection(key: "RegionLocations_locations") {
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
    getConnectionFromProps: (props) => props.region.locations,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.region.oid,
      };
    },
    query: graphql`
      query RegionLocationsPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        region(oid: $oid) {
          ...RegionLocations_region @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
