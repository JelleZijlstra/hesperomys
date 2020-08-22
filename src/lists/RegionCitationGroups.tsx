import * as React from "react";

import { RegionCitationGroups_region } from "./__generated__/RegionCitationGroups_region.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";

interface RegionCitationGroupsProps {
  region: RegionCitationGroups_region;
  title?: string;
  relay: RelayPaginationProp;
}

class RegionCitationGroups extends React.Component<
  RegionCitationGroupsProps,
  { numToLoad: number }
> {
  constructor(props: RegionCitationGroupsProps) {
    super(props);
    this.state = { numToLoad: 10 };
  }

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
