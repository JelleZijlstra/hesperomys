import * as React from "react";

import { PeriodLocationsMax_period } from "./__generated__/PeriodLocationsMax_period.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";

class PeriodLocationsMax extends React.Component<{
  period: PeriodLocationsMax_period;
  title?: string;
  relay: RelayPaginationProp;
}> {
  render() {
    const { period, relay, title } = this.props;
    if (!period.locationsMax || period.locationsMax.edges.length === 0) {
      return null;
    }
    return (
      <>
        <h3>{title || "LocationsMax"}</h3>
        <ul>
          {period.locationsMax.edges.map(
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
  PeriodLocationsMax,
  {
    period: graphql`
      fragment PeriodLocationsMax_period on Period
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        locationsMax(first: $count, after: $cursor)
          @connection(key: "PeriodLocationsMax_locationsMax") {
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
    getConnectionFromProps: (props) => props.period.locationsMax,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.period.oid,
      };
    },
    query: graphql`
      query PeriodLocationsMaxPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        period(oid: $oid) {
          ...PeriodLocationsMax_period
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
