import * as React from "react";

import { PeriodChildrenMin_period } from "./__generated__/PeriodChildrenMin_period.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";

class PeriodChildrenMin extends React.Component<{
  period: PeriodChildrenMin_period;
  title?: string;
  relay: RelayPaginationProp;
}> {
  render() {
    const { period, relay, title } = this.props;
    if (!period.childrenMin || period.childrenMin.edges.length === 0) {
      return null;
    }
    return (
      <>
        <h3>{title || "ChildrenMin"}</h3>
        <ul>
          {period.childrenMin.edges.map(
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
  PeriodChildrenMin,
  {
    period: graphql`
      fragment PeriodChildrenMin_period on Period
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        childrenMin(first: $count, after: $cursor)
          @connection(key: "PeriodChildrenMin_childrenMin") {
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
    getConnectionFromProps: (props) => props.period.childrenMin,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.period.oid,
      };
    },
    query: graphql`
      query PeriodChildrenMinPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        period(oid: $oid) {
          ...PeriodChildrenMin_period @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
