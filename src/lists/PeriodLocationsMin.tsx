import * as React from "react";

import { PeriodLocationsMin_period } from "./__generated__/PeriodLocationsMin_period.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";

class PeriodLocationsMin extends React.Component<{
  period: PeriodLocationsMin_period;
  title?: string;
  relay: RelayPaginationProp;
}> {
  render() {
    const { period, relay, title } = this.props;
    if (!period.locationsMin || period.locationsMin.edges.length === 0) {
      return null;
    }
    return (
      <>
        <h3>{title || "LocationsMin"}</h3>
        <ul>
          {period.locationsMin.edges.map(
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
  PeriodLocationsMin,
  {
    period: graphql`
      fragment PeriodLocationsMin_period on Period
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        locationsMin(first: $count, after: $cursor)
          @connection(key: "PeriodLocationsMin_locationsMin") {
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
    getConnectionFromProps: (props) => props.period.locationsMin,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.period.oid,
      };
    },
    query: graphql`
      query PeriodLocationsMinPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        period(oid: $oid) {
          ...PeriodLocationsMin_period
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
