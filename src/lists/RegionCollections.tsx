import * as React from "react";

import { RegionCollections_region } from "./__generated__/RegionCollections_region.graphql";
import { RegionCollectionsChildrenQuery } from "./__generated__/RegionCollectionsChildrenQuery.graphql";

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
import { Context } from "../components/ModelLink";

interface RegionCollectionsProps {
  region: RegionCollections_region;
  title?: string;
  subtitle?: JSX.Element;
  hideTitle?: boolean;
  hideChildren?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
  wrapperTitle?: string;
  context?: Context;
}

class RegionCollections extends React.Component<
  RegionCollectionsProps,
  { expandAll: boolean; showChildren: boolean }
> {
  constructor(props: RegionCollectionsProps) {
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
    const context = this.props.context || "Region";
    const { oid, numChildren, chilrenRegionCollections, collections } = region;
    const childrenHaveData = chilrenRegionCollections?.edges.some(
      (edge) => edge && edge.node && edge.node.hasCollections,
    );
    if (!collections || (!childrenHaveData && collections.edges.length === 0)) {
      return null;
    }
    const showExpandAll = collections.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node),
    );
    const inner = (
      <>
        {!hideTitle && <h3>{title || "Collections"}</h3>}
        {subtitle}
        {childrenHaveData && (
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
        )}
        {this.state.showChildren && (
          <QueryRenderer<RegionCollectionsChildrenQuery>
            environment={environment}
            query={graphql`
              query RegionCollectionsChildrenQuery($oid: Int!) {
                region(oid: $oid) {
                  children(first: 1000) {
                    edges {
                      node {
                        hasCollections
                        ...RegionCollections_region
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
                      edge.node.hasCollections && (
                        <li>
                          <ModelLink model={edge.node} context={context} />
                          <RegionCollectionsContainer
                            region={edge.node}
                            hideTitle
                            context={context}
                          />
                        </li>
                      ),
                  )}
                </ul>
              );
            }}
          />
        )}
        <ul>
          {collections.edges.map(
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

const RegionCollectionsContainer = createPaginationContainer(
  RegionCollections,
  {
    region: graphql`
      fragment RegionCollections_region on Region
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 50 }
        cursor: { type: "String", defaultValue: null }
      ) {
        oid
        numChildren
        chilrenRegionCollections: children(first: 1000) {
          edges {
            node {
              hasCollections
            }
          }
        }
        collections(first: $count, after: $cursor)
          @connection(key: "RegionCollections_collections") {
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
  },
);

export default RegionCollectionsContainer;
