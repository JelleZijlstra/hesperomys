import * as React from "react";

import { RegionLocations_region } from "./__generated__/RegionLocations_region.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";

interface RegionLocationsProps {
  region: RegionLocations_region;
  title?: string;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
}

class RegionLocations extends React.Component<
  RegionLocationsProps,
  { expandAll: boolean }
> {
  constructor(props: RegionLocationsProps) {
    super(props);
    this.state = { expandAll: false };
  }

  render() {
    const { region, relay, numToLoad, hideTitle, title } = this.props;
    if (!region.locations || region.locations.edges.length === 0) {
      return null;
    }
    return (
      <>
        {!hideTitle && <h3>{title || "Locations"}</h3>}
        <ul>
          {region.locations.edges.map(
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
          numToLoad={numToLoad || 10}
          relay={relay}
          expandAll={this.state.expandAll}
          setExpandAll={(expandAll: boolean) => this.setState({ expandAll })}
        />
      </>
    );
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
              ...ModelListEntry_model
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
