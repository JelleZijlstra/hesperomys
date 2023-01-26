import * as React from "react";

import { RegionTypeLocalities_region } from "./__generated__/RegionTypeLocalities_region.graphql";
import { RegionTypeLocalitiesChildrenQuery } from "./__generated__/RegionTypeLocalitiesChildrenQuery.graphql";

import {
  createPaginationContainer,
  RelayPaginationProp,
  QueryRenderer,
} from "react-relay";
import graphql from "babel-plugin-relay/macro";

import environment from "../relayEnvironment";
import ExpandButtons from "./ExpandButtons";
import LoadMoreButton from "../components/LoadMoreButton";
import ModelLink from "../components/ModelLink";
import ModelListEntry from "../components/ModelListEntry";

interface RegionTypeLocalitiesProps {
  region: RegionTypeLocalities_region;
  title?: string;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
}

class RegionTypeLocalities extends React.Component<
  RegionTypeLocalitiesProps,
  { expandAll: boolean; showChildren: boolean }
> {
  constructor(props: RegionTypeLocalitiesProps) {
    super(props);
    this.state = { expandAll: false, showChildren: false };
  }

  render() {
    const { region, relay, numToLoad, hideTitle, title } = this.props;
    const { oid, numChildren, locations, hasTypeLocalities } = region;
    if (
      !locations ||
      !hasTypeLocalities ||
      (numChildren === 0 && locations.edges.length === 0)
    ) {
      return null;
    }
    return (
      <>
        {!hideTitle && <h3>{title || "Type localities"}</h3>}
        <ExpandButtons
          expandAll={this.state.expandAll}
          setExpandAll={(expandAll: boolean) => this.setState({ expandAll })}
          showChildren={this.state.showChildren}
          setShowChildren={
            numChildren > 0
              ? (showChildren) => this.setState({ showChildren })
              : undefined
          }
        />
        {this.state.showChildren && (
          <QueryRenderer<RegionTypeLocalitiesChildrenQuery>
            environment={environment}
            query={graphql`
              query RegionTypeLocalitiesChildrenQuery($oid: Int!) {
                region(oid: $oid) {
                  children(first: 1000) {
                    edges {
                      node {
                        hasTypeLocalities
                        ...RegionTypeLocalities_region
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
                      edge.node.hasTypeLocalities && (
                        <li>
                          <ModelLink model={edge.node} />
                          <RegionTypeLocalitiesContainer region={edge.node} hideTitle />
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
              edge.node &&
              edge.node.numTypeLocalities > 0 && (
                <ModelListEntry
                  key={edge.node.oid}
                  model={edge.node}
                  showChildren={this.state.expandAll}
                />
              )
          )}
        </ul>
        <LoadMoreButton numToLoad={numToLoad || 100} relay={relay} />
      </>
    );
  }
}

const RegionTypeLocalitiesContainer = createPaginationContainer(
  RegionTypeLocalities,
  {
    region: graphql`
      fragment RegionTypeLocalities_region on Region
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 50 }
        cursor: { type: "String", defaultValue: null }
      ) {
        oid
        numChildren
        hasTypeLocalities
        locations(first: $count, after: $cursor)
          @connection(key: "RegionTypeLocalities_locations") {
          edges {
            node {
              numTypeLocalities
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
      query RegionTypeLocalitiesPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        region(oid: $oid) {
          ...RegionTypeLocalities_region @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);

export default RegionTypeLocalitiesContainer;
