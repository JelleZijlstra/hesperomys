import * as React from "react";

import { RegionCitationGroups_region } from "./__generated__/RegionCitationGroups_region.graphql";
import { RegionCitationGroupsChildrenQuery } from "./__generated__/RegionCitationGroupsChildrenQuery.graphql";

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

interface RegionCitationGroupsProps {
  region: RegionCitationGroups_region;
  title?: string;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
}

class RegionCitationGroups extends React.Component<
  RegionCitationGroupsProps,
  { expandAll: boolean; showChildren: boolean }
> {
  constructor(props: RegionCitationGroupsProps) {
    super(props);
    this.state = { expandAll: false, showChildren: false };
  }

  render() {
    const { region, relay, numToLoad, hideTitle, title } = this.props;
    const { oid, numChildren, citationGroups } = region;
    if (
      !citationGroups ||
      (numChildren === 0 && citationGroups.edges.length === 0)
    ) {
      return null;
    }
    return (
      <>
        {!hideTitle && <h3>{title || "CitationGroups"}</h3>}
        {this.state.showChildren && (
          <QueryRenderer<RegionCitationGroupsChildrenQuery>
            environment={environment}
            query={graphql`
              query RegionCitationGroupsChildrenQuery($oid: Int!) {
                region(oid: $oid) {
                  children(first: 1000) {
                    edges {
                      node {
                        hasCitationGroups
                        ...RegionCitationGroups_region
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
                      edge.node.hasCitationGroups && (
                        <li>
                          <ModelLink model={edge.node} />
                          <RegionCitationGroupsContainer
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
          {citationGroups.edges.map(
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
          setExpandAll={undefined}
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

const RegionCitationGroupsContainer = createPaginationContainer(
  RegionCitationGroups,
  {
    region: graphql`
      fragment RegionCitationGroups_region on Region
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        numChildren
        citationGroups(first: $count, after: $cursor)
          @connection(key: "RegionCitationGroups_citationGroups") {
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
    getConnectionFromProps: (props) => props.region.citationGroups,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.region.oid,
      };
    },
    query: graphql`
      query RegionCitationGroupsPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        region(oid: $oid) {
          ...RegionCitationGroups_region
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);

export default RegionCitationGroupsContainer;
