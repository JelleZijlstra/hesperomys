import * as React from "react";

import { PeriodChildren_period } from "./__generated__/PeriodChildren_period.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";

interface PeriodChildrenProps {
  period: PeriodChildren_period;
  title?: string;
  relay: RelayPaginationProp;
}

class PeriodChildren extends React.Component<
  PeriodChildrenProps,
  { numToLoad: number }
> {
  constructor(props: PeriodChildrenProps) {
    super(props);
    this.state = { numToLoad: 10 };
  }

  render() {
    const { period, relay, title } = this.props;
    if (!period.children || period.children.edges.length === 0) {
      return null;
    }
    return (
      <>
        <h3>{title || "Children"}</h3>
        <ul>
          {period.children.edges.map(
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
  PeriodChildren,
  {
    period: graphql`
      fragment PeriodChildren_period on Period
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        children(first: $count, after: $cursor)
          @connection(key: "PeriodChildren_children") {
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
    getConnectionFromProps: (props) => props.period.children,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.period.oid,
      };
    },
    query: graphql`
      query PeriodChildrenPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        period(oid: $oid) {
          ...PeriodChildren_period @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
