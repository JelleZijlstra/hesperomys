import * as React from "react";

import { RegionCollections_region } from "./__generated__/RegionCollections_region.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";

interface RegionCollectionsProps {
  region: RegionCollections_region;
  title?: string;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
}

class RegionCollections extends React.Component<
  RegionCollectionsProps,
  { expandAll: boolean }
> {
  constructor(props: RegionCollectionsProps) {
    super(props);
    this.state = { expandAll: false };
  }

  render() {
    const { region, relay, numToLoad, hideTitle, title } = this.props;
    if (!region.collections || region.collections.edges.length === 0) {
      return null;
    }
    return (
      <>
        {!hideTitle && <h3>{title || "Collections"}</h3>}
        <ul>
          {region.collections.edges.map(
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
              ...ModelListEntry_model
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
