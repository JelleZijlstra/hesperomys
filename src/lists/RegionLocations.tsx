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
import ExpandButtons from "../components/ExpandButtons";
import LoadMoreButton from "../components/LoadMoreButton";
import ModelLink from "../components/ModelLink";
import ModelListEntry from "../components/ModelListEntry";
import { supportsChildren } from "../components/ModelChildList";

interface RegionLocationsProps {
  region: RegionLocations_region;
  title?: string;
  subtitle?: JSX.Element;
  hideTitle?: boolean;
  hideChildren?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
  wrapperTitle?: string;
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
    const {
      region,
      relay,
      numToLoad,
      hideTitle,
      hideChildren,
      title,
      subtitle,
      wrapperTitle,
    } = this.props;
    const { oid, numChildren, locations } = region;
    if (!locations || (numChildren === 0 && locations.edges.length === 0)) {
      return null;
    }
    const showExpandAll = locations.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node),
    );
    const inner = (
      <>
        {!hideTitle && (
          <h3>
            {title || "Locations"} ({numChildren})
          </h3>
        )}
        {subtitle}
        <ExpandButtons
          expandAll={this.state.expandAll}
          setExpandAll={
            showExpandAll
              ? (expandAll: boolean) => this.setState({ expandAll })
              : undefined
          }
          showChildren={this.state.showChildren}
          setShowChildren={
            numChildren > 0 && !hideChildren
              ? (showChildren) => this.setState({ showChildren })
              : undefined
          }
        />
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
                          <RegionLocationsContainer region={edge.node} hideTitle />
                        </li>
                      ),
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
              ),
          )}
        </ul>
        <LoadMoreButton numToLoad={numToLoad} relay={relay} />
      </>
    );
    if (wrapperTitle) {
      return (
        <div>
          <i>{wrapperTitle}</i>
          {inner}
        </div>
      );
    }
    return inner;
  }
}

const RegionLocationsContainer = createPaginationContainer(
  RegionLocations,
  {
    region: graphql`
      fragment RegionLocations_region on Region
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 50 }
        cursor: { type: "String", defaultValue: null }
      ) {
        oid
        numChildren
        locations(first: $count, after: $cursor)
          @connection(key: "RegionLocations_locations") {
          edges {
            node {
              oid
              __typename
              ...ModelListEntry_model
              ...ModelChildList_model @relay(mask: false)
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
      query RegionLocationsPaginationQuery($count: Int!, $cursor: String, $oid: Int!) {
        region(oid: $oid) {
          ...RegionLocations_region @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  },
);

export default RegionLocationsContainer;
