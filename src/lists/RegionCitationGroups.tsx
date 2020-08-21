import * as React from "react";

import { RegionCitationGroups_region } from "./__generated__/RegionCitationGroups_region.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";

class RegionCitationGroups extends React.Component<{
  region: RegionCitationGroups_region;
  title?: string;
  relay: RelayPaginationProp;
}> {
  render() {
    const { region, relay, title } = this.props;
    if (!region.citationGroups || region.citationGroups.edges.length === 0) {
      return null;
    }
    return (
      <>
        <h3>{title || "CitationGroups"}</h3>
        <ul>
          {region.citationGroups.edges.map(
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
  RegionCitationGroups,
  {
    region: graphql`
      fragment RegionCitationGroups_region on Region
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        citationGroups(first: $count, after: $cursor)
          @connection(key: "RegionCitationGroups_citationGroups") {
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
