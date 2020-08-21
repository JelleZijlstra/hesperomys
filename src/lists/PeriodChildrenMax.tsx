import * as React from "react";

import { PeriodChildrenMax_period } from "./__generated__/PeriodChildrenMax_period.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";

class PeriodChildrenMax extends React.Component<{
  period: PeriodChildrenMax_period;
  title?: string;
  relay: RelayPaginationProp;
}> {
  render() {
    const { period, relay, title } = this.props;
    if (!period.childrenMax || period.childrenMax.edges.length === 0) {
      return null;
    }
    return (
      <>
        <h3>{title || "ChildrenMax"}</h3>
        <ul>
          {period.childrenMax.edges.map(
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
  PeriodChildrenMax,
  {
    period: graphql`
      fragment PeriodChildrenMax_period on Period
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        childrenMax(first: $count, after: $cursor)
          @connection(key: "PeriodChildrenMax_childrenMax") {
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
    getConnectionFromProps: (props) => props.period.childrenMax,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.period.oid,
      };
    },
    query: graphql`
      query PeriodChildrenMaxPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        period(oid: $oid) {
          ...PeriodChildrenMax_period @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
