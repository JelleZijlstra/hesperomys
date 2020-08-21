import * as React from "react";

import { RegionPeriods_region } from "./__generated__/RegionPeriods_region.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";

class RegionPeriods extends React.Component<{
  region: RegionPeriods_region;
  title?: string;
  relay: RelayPaginationProp;
}> {
  render() {
    const { region, relay, title } = this.props;
    if (!region.periods || region.periods.edges.length === 0) {
      return null;
    }
    return (
      <>
        <h3>{title || "Periods"}</h3>
        <ul>
          {region.periods.edges.map(
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
  RegionPeriods,
  {
    region: graphql`
      fragment RegionPeriods_region on Region
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        periods(first: $count, after: $cursor)
          @connection(key: "RegionPeriods_periods") {
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
    getConnectionFromProps: (props) => props.region.periods,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.region.oid,
      };
    },
    query: graphql`
      query RegionPeriodsPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        region(oid: $oid) {
          ...RegionPeriods_region @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
