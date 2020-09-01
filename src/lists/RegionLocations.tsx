import * as React from "react";

import { RegionLocations_region } from "./__generated__/RegionLocations_region.graphql";
import { RegionLocationsChildrenQuery } from "./__generated__/RegionLocationsChildrenQuery.graphql";

import {
  createPaginationContainer,
  RelayPaginationProp,
  QueryRenderer,
} from "react-relay";
import graphql from "babel-plugin-relay/macro";

import environment from "../relayEnvironment";
import LoadMoreButton from "../components/LoadMoreButton";
import ModelLink from "../components/ModelLink";
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
  { expandAll: boolean; showChildren: boolean }
> {
  constructor(props: RegionLocationsProps) {
    super(props);
    this.state = { expandAll: false, showChildren: false };
  }

  render() {
    const { region, relay, numToLoad, hideTitle, title } = this.props;
    const { oid, numChildren, locations } = region;
    if (!locations || (numChildren === 0 && locations.edges.length === 0)) {
      return null;
    }
    return (
      <>
        {!hideTitle && <h3>{title || "Locations"}</h3>}
        {this.state.showChildren && (
          <QueryRenderer<RegionLocationsChildrenQuery>
            environment={environment}
            query={graphql`
              query RegionLocationsChildrenQuery($oid: Int!) {
                region(oid: $oid) {
                  children(first: 1000) {
                    edges {
                      node {
                        hasLocations
                        ...RegionLocations_region
                        ...ModelLink_model
                      }
                    }
                  }
                }
              }
            `}
            variables={{ oid }}
            render={({ error, props }) => {
              if (error) {
                return <div>Failed to load</div>;
              }
              if (!props || !props.region || !props.region.children) {
                return <div>Loading...</div>;
              }
              const { edges } = props.region.children;
              return (
                <ul>
                  {edges.map(
                    (edge) =>
                      edge &&
                      edge.node &&
                      edge.node.hasLocations && (
                        <li>
                          <ModelLink model={edge.node} />
                          <RegionLocationsContainer
                            region={edge.node}
                            hideTitle
                          />
                        </li>
                      )
                  )}
                </ul>
              );
            }}
          />
        )}
        <ul>
          {locations.edges.map(
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
          showChildren={this.state.showChildren}
          setShowChildren={
            numChildren > 0
              ? (showChildren) => this.setState({ showChildren })
              : undefined
          }
        />
      </>
    );
  }
}

const RegionLocationsContainer = createPaginationContainer(
  RegionLocations,
  {
    region: graphql`
      fragment RegionLocations_region on Region
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        numChildren
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

export default RegionLocationsContainer;
