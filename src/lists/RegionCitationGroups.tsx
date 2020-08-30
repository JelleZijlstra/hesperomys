import * as React from "react";

import { RegionCitationGroups_region } from "./__generated__/RegionCitationGroups_region.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";

interface RegionCitationGroupsProps {
  region: RegionCitationGroups_region;
  title?: string;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
}

class RegionCitationGroups extends React.Component<RegionCitationGroupsProps> {
  render() {
    const { region, relay, numToLoad, hideTitle, title } = this.props;
    if (!region.citationGroups || region.citationGroups.edges.length === 0) {
      return null;
    }
    return (
      <>
        {!hideTitle && <h3>{title || "CitationGroups"}</h3>}
        <ul>
          {region.citationGroups.edges.map(
            (edge) =>
              edge &&
              edge.node && (
                <ModelListEntry key={edge.node.oid} model={edge.node} />
              )
          )}
        </ul>
        <LoadMoreButton numToLoad={numToLoad || 10} relay={relay} />
      </>
    );
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
